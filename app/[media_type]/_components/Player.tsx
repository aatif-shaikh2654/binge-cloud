"use client";

import { type PlayerServer } from "@/app/constants/player";
import { TMDB_IMAGE_BASE_URL } from "@/app/constants/tmdb";
import { useHistoryStore } from "@/app/store/useHistoryStore";
import { type MediaType } from "@/app/types/common";
import { type TMDBMovie, type TMDBSeason } from "@/app/types/tmdb";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";

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

  // Calculate Initial Start Time (only once per media/episode)
  const initialStartTime = useMemo(() => {
    const savedItem = history.find(
      (h) =>
        h.id === Number(id) &&
        h.media_type === tmdbType &&
        (tmdbType === "tv"
          ? h.season === season && h.episode === episode
          : true),
    );

    if (savedItem?.currentTime && savedItem.currentTime > 10) {
      return Math.floor(savedItem.currentTime);
    }
    return 0;
  }, [id, tmdbType, season, episode, history]);

  let videoUrl =
    tmdbType === "tv"
      ? currentServer.tvUrl(id, season, episode)
      : currentServer.movieUrl(id);

  // Apply Resume Parameters for Vidnest
  if (
    currentServer.id === "vidnest" &&
    initialStartTime !== null &&
    initialStartTime > 0
  ) {
    const paramName = tmdbType === "tv" ? "progress" : "startAt";
    const separator = videoUrl.includes("?") ? "&" : "?";
    videoUrl += `${separator}${paramName}=${initialStartTime}`;
  }

  // Reset video loaded state when URL changes (Sync state with URL during render)
  const [prevUrl, setPrevUrl] = useState(videoUrl);
  if (videoUrl !== prevUrl) {
    setPrevUrl(videoUrl);
    setIsVideoLoaded(false);
  }

  // Player Events Listener
  useEffect(() => {
    latestProgressRef.current = { currentTime: 0, duration: 0 };
    lastSaveTimeRef.current = Date.now();

    const trackProgress = (
      currentTime: number,
      duration: number,
      force = false,
    ) => {
      if (!details) return;
      latestProgressRef.current = { currentTime, duration };
      const now = Date.now();

      if (force || now - lastSaveTimeRef.current >= 5 * 60 * 1000) {
        lastSaveTimeRef.current = now;
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
          currentTime,
          duration,
        });
      }
    };

    const handleMessage = (event: MessageEvent) => {
      let data = event.data;

      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }

      // Handle Vidnest Player Events (MEDIA_DATA)
      if (
        event.origin === "https://vidnest.fun" &&
        data.type === "MEDIA_DATA"
      ) {
        const mediaData = data.data;
        const currentTime = mediaData.currentTime;
        const duration = mediaData.duration;

        if (currentTime !== undefined && duration !== undefined) {
          trackProgress(currentTime, duration);

          // Auto-next for TV shows on completion
          if (
            tmdbType === "tv" &&
            duration > 0 &&
            currentTime >= duration - 1
          ) {
            const currentSeasonData = seasons?.find(
              (s) => s.season_number === season,
            );
            if (currentSeasonData) {
              if (episode < currentSeasonData.episode_count) {
                onEpisodeChange(season, episode + 1);
              } else {
                const nextSeason = seasons?.find(
                  (s) => s.season_number === season + 1,
                );
                if (nextSeason) {
                  onEpisodeChange(season + 1, 1);
                }
              }
            }
          }
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
      const { currentTime, duration } = latestProgressRef.current;
      if (currentTime > 0 && duration > 0) {
        trackProgress(currentTime, duration, true);
      }
    };
  }, [
    id,
    tmdbType,
    details,
    currentServer.id,
    season,
    episode,
    addToHistory,
    seasons,
    onEpisodeChange,
  ]);

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

      <iframe
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
