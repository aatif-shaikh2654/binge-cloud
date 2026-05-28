"use client";

import React, { useEffect, useRef } from "react";
import { type TMDBSeason } from "@/app/types/tmdb";
import { type MediaType } from "@/app/types/common";

interface VidsrcServerProps {
  id: string;
  tmdbType: MediaType;
  season: number;
  episode: number;
  seasons?: TMDBSeason[];
  onEpisodeChange: (s: number, e: number) => void;
  trackProgress: (currentTime: number, duration: number, force?: boolean) => void;
}

export const VidsrcServer: React.FC<VidsrcServerProps> = ({
  id,
  tmdbType,
  season,
  episode,
  seasons,
  onEpisodeChange,
  trackProgress,
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
    const handleMessage = (event: MessageEvent) => {
      let data = event.data;

      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }

      if (event.origin !== "https://www.vidsrc.wtf") return;

      const currentProps = propsRef.current;

      if (data?.type === "MEDIA_DATA") {
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
  }, []);

  return null;
};
