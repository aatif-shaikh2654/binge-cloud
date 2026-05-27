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

  // Reset progress tracking refs when navigating to a new episode/season/movie
  useEffect(() => {
    latestProgressRef.current = { currentTime: 0, duration: 0 };
    lastSaveTimeRef.current = Date.now();
  }, [id, tmdbType, season, episode, currentServer.id]);

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

  // Apply Resume Parameters for Server 1 (Vidnest)
  if (
    currentServer.id === "server-1" &&
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

    const handleMessage = (event: MessageEvent) => {
      let data = event.data;

      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }

      const currentProps = propsRef.current;

      // Handle Vidnest Player Events (PLAYER_EVENT and MEDIA_DATA)
      if (
        event.origin === "https://vidnest.fun"
      ) {
        if (data?.type === "PLAYER_EVENT") {
          const { currentTime, duration } = data.data || {};
          if (currentTime !== undefined && duration !== undefined) {
            trackProgress(currentTime, duration);

            // Auto-next for TV shows on completion
            if (
              currentProps.tmdbType === "tv" &&
              duration > 0 &&
              currentTime >= duration - 1
            ) {
              const currentSeasonData = currentProps.seasons?.find(
                (s) => s.season_number === currentProps.season,
              );
              if (currentSeasonData) {
                if (currentProps.episode < currentSeasonData.episode_count) {
                  currentProps.onEpisodeChange(
                    currentProps.season,
                    currentProps.episode + 1,
                  );
                } else {
                  const nextSeason = currentProps.seasons?.find(
                    (s) => s.season_number === currentProps.season + 1,
                  );
                  if (nextSeason) {
                    currentProps.onEpisodeChange(currentProps.season + 1, 1);
                  }
                }
              }
            }
          }
        } else if (data?.type === "MEDIA_DATA") {
          const mediaData = data.data;

          // Save progress to local storage as requested by docs
          try {
            localStorage.setItem("vidNestProgress", JSON.stringify(mediaData));
          } catch (e) {
            console.error("Failed to save vidNestProgress to localStorage", e);
          }

          let currentTime: number | undefined;
          let duration: number | undefined;

          if (currentProps.tmdbType === "tv") {
            const episodeKey = `s${currentProps.season}e${currentProps.episode}`;
            const tvProgress =
              mediaData?.[currentProps.id]?.show_progress?.[episodeKey]
                ?.progress ||
              mediaData?.show_progress?.[episodeKey]?.progress ||
              mediaData?.[currentProps.id]?.progress ||
              mediaData?.progress;

            if (tvProgress) {
              currentTime = tvProgress.watched;
              duration = tvProgress.duration;
            }
          } else {
            const movieProgress =
              mediaData?.[currentProps.id]?.progress || mediaData?.progress;
            if (movieProgress) {
              currentTime = movieProgress.watched;
              duration = movieProgress.duration;
            }
          }

          // Fallback to top-level properties if available directly
          if (currentTime === undefined && duration === undefined && mediaData) {
            currentTime = mediaData.currentTime ?? mediaData.watched;
            duration = mediaData.duration;
          }

          if (currentTime !== undefined && duration !== undefined) {
            trackProgress(currentTime, duration);

            // Auto-next for TV shows on completion
            if (
              currentProps.tmdbType === "tv" &&
              duration > 0 &&
              currentTime >= duration - 1
            ) {
              const currentSeasonData = currentProps.seasons?.find(
                (s) => s.season_number === currentProps.season,
              );
              if (currentSeasonData) {
                if (currentProps.episode < currentSeasonData.episode_count) {
                  currentProps.onEpisodeChange(
                    currentProps.season,
                    currentProps.episode + 1,
                  );
                } else {
                  const nextSeason = currentProps.seasons?.find(
                    (s) => s.season_number === currentProps.season + 1,
                  );
                  if (nextSeason) {
                    currentProps.onEpisodeChange(currentProps.season + 1, 1);
                  }
                }
              }
            }
          }
        }
      }

      // Handle Vidsrc.wtf Player Events (MEDIA_DATA)
      if (
        event.origin === "https://www.vidsrc.wtf" &&
        data?.type === "MEDIA_DATA"
      ) {
        const mediaData = data.data;

        // Save progress to local storage as requested by docs
        try {
          localStorage.setItem("vidsrcwtf-Progress", JSON.stringify(mediaData));
        } catch (e) {
          console.error("Failed to save vidsrcwtf-Progress to localStorage", e);
        }

        let currentTime: number | undefined;
        let duration: number | undefined;

        if (currentProps.tmdbType === "tv") {
          const episodeKey = `s${currentProps.season}e${currentProps.episode}`;
          const tvProgress =
            mediaData?.[currentProps.id]?.show_progress?.[episodeKey]
              ?.progress ||
            mediaData?.show_progress?.[episodeKey]?.progress ||
            mediaData?.[currentProps.id]?.progress ||
            mediaData?.progress;

          if (tvProgress) {
            currentTime = tvProgress.watched;
            duration = tvProgress.duration;
          }
        } else {
          const movieProgress =
            mediaData?.[currentProps.id]?.progress || mediaData?.progress;
          if (movieProgress) {
            currentTime = movieProgress.watched;
            duration = movieProgress.duration;
          }
        }

        // Fallback to top-level properties if available directly
        if (currentTime === undefined && duration === undefined && mediaData) {
          currentTime = mediaData.currentTime ?? mediaData.watched;
          duration = mediaData.duration;
        }

        if (currentTime !== undefined && duration !== undefined) {
          trackProgress(currentTime, duration);

          // Auto-next for TV shows on completion
          if (
            currentProps.tmdbType === "tv" &&
            duration > 0 &&
            currentTime >= duration - 1
          ) {
            const currentSeasonData = currentProps.seasons?.find(
              (s) => s.season_number === currentProps.season,
            );
            if (currentSeasonData) {
              if (currentProps.episode < currentSeasonData.episode_count) {
                currentProps.onEpisodeChange(
                  currentProps.season,
                  currentProps.episode + 1,
                );
              } else {
                const nextSeason = currentProps.seasons?.find(
                  (s) => s.season_number === currentProps.season + 1,
                );
                if (nextSeason) {
                  currentProps.onEpisodeChange(currentProps.season + 1, 1);
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
