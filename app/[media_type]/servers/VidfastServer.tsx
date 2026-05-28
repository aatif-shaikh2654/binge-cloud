"use client";

import React, { useEffect, useRef } from "react";
import { type TMDBSeason } from "@/app/types/tmdb";
import { type MediaType } from "@/app/types/common";

interface VidfastServerProps {
  id: string;
  tmdbType: MediaType;
  season: number;
  episode: number;
  seasons?: TMDBSeason[];
  onEpisodeChange: (s: number, e: number) => void;
  trackProgress: (currentTime: number, duration: number, force?: boolean) => void;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

export const VidfastServer: React.FC<VidfastServerProps> = ({
  id,
  tmdbType,
  season,
  episode,
  seasons,
  onEpisodeChange,
  trackProgress,
  iframeRef,
}) => {
  const propsRef = useRef({
    id,
    tmdbType,
    season,
    episode,
    seasons,
    onEpisodeChange,
    trackProgress,
  });

  useEffect(() => {
    propsRef.current = {
      id,
      tmdbType,
      season,
      episode,
      seasons,
      onEpisodeChange,
      trackProgress,
    };
  });

  useEffect(() => {
    const isVidfastOrigin = (origin: string) => {
      return [
        "https://vidfast.pro",
        "https://vidfast.in",
        "https://vidfast.io",
        "https://vidfast.me",
        "https://vidfast.net",
        "https://vidfast.pm",
        "https://vidfast.xyz",
      ].includes(origin);
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return;

      let data = event.data;

      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }

      if (!isVidfastOrigin(event.origin)) return;

      const currentProps = propsRef.current;

      if (data?.type === "PLAYER_EVENT") {
        const { currentTime, duration } = data.data || {};
        if (currentTime !== undefined && duration !== undefined) {
          currentProps.trackProgress(currentTime, duration);

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
          localStorage.setItem("vidFastProgress", JSON.stringify(mediaData));
        } catch (e) {
          console.error("Failed to save vidFastProgress to localStorage", e);
        }

        const hasShowProgress = !!(
          mediaData?.[currentProps.id]?.show_progress ||
          mediaData?.show_progress
        );

        let currentTime: number | undefined;
        let duration: number | undefined;

        if (currentProps.tmdbType === "tv") {
          const episodeKey = `s${currentProps.season}e${currentProps.episode}`;
          let tvProgress;
          if (hasShowProgress) {
            tvProgress =
              mediaData?.[currentProps.id]?.show_progress?.[episodeKey]?.progress ||
              mediaData?.show_progress?.[episodeKey]?.progress;
          } else {
            tvProgress =
              mediaData?.[currentProps.id]?.progress ||
              mediaData?.progress;
          }

          if (tvProgress) {
            currentTime = tvProgress.watched;
            duration = tvProgress.duration;
          }
        } else {
          const movieProgress = !hasShowProgress
            ? (mediaData?.[currentProps.id]?.progress || mediaData?.progress)
            : undefined;
          if (movieProgress) {
            currentTime = movieProgress.watched;
            duration = movieProgress.duration;
          }
        }

        // Fallback to top-level properties if available directly (only if this is not a database dump payload)
        if (
          currentTime === undefined &&
          duration === undefined &&
          mediaData &&
          !hasShowProgress
        ) {
          currentTime = mediaData.currentTime ?? mediaData.watched;
          duration = mediaData.duration;
        }

        if (currentTime !== undefined && duration !== undefined) {
          currentProps.trackProgress(currentTime, duration);

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
    };
  }, [iframeRef]);

  return null;
};
