"use client";

import { type PlayerServer } from "@/app/constants/player";
import { TMDB_IMAGE_BASE_URL } from "@/app/constants/tmdb";
import { useHistoryStore } from "@/app/store/useHistoryStore";
import { type MediaType } from "@/app/types/common";
import { type TMDBMovie, type TMDBSeason } from "@/app/types/tmdb";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { VidnestServer } from "../servers/VidnestServer";
import { VidsrcServer } from "../servers/VidsrcServer";
import { VidfastServer } from "../servers/VidfastServer";

const TRACKING_COMPONENTS = {
  vidnest: VidnestServer,
  vidsrc: VidsrcServer,
  vidfast: VidfastServer,
} as const;

interface PlayerProps {
  id: string;
  tmdbType: MediaType;
  currentServer: PlayerServer;
  season: number;
  episode: number;
  details: TMDBMovie;
  seasons?: TMDBSeason[];
  onEpisodeChange: (s: number, e: number) => void;
}

const Player: React.FC<PlayerProps> = ({
  id,
  tmdbType,
  currentServer,
  season,
  episode,
  details,
  seasons,
  onEpisodeChange,
}) => {
  const addToHistory = useHistoryStore((state) => state.addToHistory);
  const history = useHistoryStore((state) => state.history);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const latestProgressRef = useRef({ currentTime: 0, duration: 0 });
  const lastSaveTimeRef = useRef(0);

  // Sync props to ref to avoid ESLint rules about refs in render and race conditions
  const propsRef = useRef({
    id,
    tmdbType,
    currentServer,
    season,
    episode,
    details,
    seasons,
    onEpisodeChange,
    addToHistory,
  });
  useEffect(() => {
    propsRef.current = {
      id,
      tmdbType,
      currentServer,
      season,
      episode,
      details,
      seasons,
      onEpisodeChange,
      addToHistory,
    };
  });

  const [initialStartTime, setInitialStartTime] = useState<number | null>(null);

  // Reset progress tracking refs and initialStartTime when navigating to a new episode/season/movie/server
  useEffect(() => {
    latestProgressRef.current = { currentTime: 0, duration: 0 };
    lastSaveTimeRef.current = Date.now();
    setInitialStartTime(null); // eslint-disable-line react-hooks/set-state-in-effect
  }, [id, tmdbType, season, episode, currentServer.id]);

  // Resolve start time from history once per navigation
  useEffect(() => {
    if (initialStartTime !== null) return;

    const savedItem = history.find(
      (h) =>
        h.id === Number(id) &&
        h.media_type === tmdbType &&
        (tmdbType === "tv"
          ? h.season === season && h.episode === episode
          : true),
    );

    if (savedItem || history.length > 0) {
      const time = savedItem?.currentTime && savedItem.currentTime > 10
        ? Math.floor(savedItem.currentTime)
        : 0;
      setInitialStartTime(time); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [id, tmdbType, season, episode, currentServer.id, history, initialStartTime]);

  const imdbId = details?.external_ids?.imdb_id || details?.imdb_id;

  const videoUrl =
    tmdbType === "tv"
      ? currentServer.tvUrl(id, season, episode, initialStartTime || undefined, imdbId)
      : currentServer.movieUrl(id, initialStartTime || undefined, imdbId);

  // Reset video loaded state when URL changes (Sync state with URL during render)
  const [prevUrl, setPrevUrl] = useState(videoUrl);
  if (videoUrl !== prevUrl) {
    setPrevUrl(videoUrl);
    setIsVideoLoaded(false);
  }

  const trackProgress = (
    currentTime: number,
    duration: number,
    force = false,
  ) => {
    const currentProps = propsRef.current;
    if (!currentProps.details) return;
    latestProgressRef.current = { currentTime, duration };
    const now = Date.now();

    if (force || now - lastSaveTimeRef.current >= 5 * 60 * 1000) {
      lastSaveTimeRef.current = now;
      currentProps.addToHistory({
        id: Number(currentProps.id),
        media_type: currentProps.tmdbType,
        title:
          currentProps.details.title ||
          currentProps.details.name ||
          "Unknown",
        poster_path: currentProps.details.poster_path || "",
        backdrop_path: currentProps.details.backdrop_path || "",
        server: currentProps.currentServer.id,
        season:
          currentProps.tmdbType === "tv" ? currentProps.season : undefined,
        episode:
          currentProps.tmdbType === "tv" ? currentProps.episode : undefined,
        watchedAt: Date.now(),
        currentTime,
        duration,
      });
    }
  };

  // Player Events Cleanup
  useEffect(() => {
    return () => {
      const { currentTime, duration } = latestProgressRef.current;
      if (currentTime > 0 && duration > 0) {
        trackProgress(currentTime, duration, true);
      }
    };
  }, []);

  // Initial history entry
  useEffect(() => {
    if (!details) return;

    addToHistory({
      id: Number(id),
      media_type: tmdbType,
      title: details.title || details.name || "Unknown",
      poster_path: details.poster_path || "",
      backdrop_path: details.backdrop_path || "",
      server: currentServer.id,
      season: tmdbType === "tv" ? season : undefined,
      episode: tmdbType === "tv" ? episode : undefined,
      watchedAt: Date.now(),
    });
  }, [id, tmdbType, details, currentServer.id, season, episode, addToHistory]);

  const TrackingComponent = currentServer.trackingType
    ? TRACKING_COMPONENTS[currentServer.trackingType]
    : null;

  return (
    <div className="absolute inset-0 z-0 bg-background overflow-hidden">
      {/* Backdrop / Loader Layer */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background">
          <Image
            src={`${TMDB_IMAGE_BASE_URL}/original${details.backdrop_path || details.poster_path}`}
            alt="Backdrop"
            fill
            sizes="100vw"
            className="object-cover opacity-20 blur-sm scale-110"
            priority
          />
          <div className="relative z-20 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-white/60 font-medium animate-pulse">
              Initializing Player...
            </p>
          </div>
        </div>
      )}

      {TrackingComponent && (
        <TrackingComponent
          id={id}
          tmdbType={tmdbType}
          season={season}
          episode={episode}
          seasons={seasons}
          onEpisodeChange={onEpisodeChange}
          trackProgress={trackProgress}
          iframeRef={iframeRef}
        />
      )}

      <iframe
        key={videoUrl}
        ref={iframeRef}
        src={videoUrl}
        className={cn(
          "w-full h-full border-none transition-opacity duration-1000",
          isVideoLoaded
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        allowFullScreen
        allow="autoplay; encrypted-media; picture-in-picture"
        onLoad={() => setIsVideoLoaded(true)}
        title="BingeCloud Video Player"
      />
    </div>
  );
};

export default Player;
