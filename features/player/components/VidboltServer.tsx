"use client";

import React, { useEffect, useRef } from "react";
import { type TMDBSeason } from "@/features/media/types/tmdb";
import { type MediaType } from "@/shared/types/common";

interface VidboltServerProps {
  id: string;
  tmdbType: MediaType;
  season: number;
  episode: number;
  seasons?: TMDBSeason[];
  onEpisodeChange: (s: number, e: number) => void;
  trackProgress: (currentTime: number, duration: number, force?: boolean) => void;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

export const VidboltServer: React.FC<VidboltServerProps> = ({
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

  const durationRef = useRef(0);

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
    const isVidboltOrigin = (origin: string) => {
      return origin === "https://vidbolt.xyz" || origin === "https://vidbolt.pro";
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (!isVidboltOrigin(event.origin)) return;

      let data = event.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }

      if (!data || typeof data !== "object") return;

      const currentProps = propsRef.current;

      if (data.type === "durationchange" && typeof data.duration === "number") {
        durationRef.current = data.duration;
      }

      if (data.type === "timeupdate" && typeof data.time === "number") {
        currentProps.trackProgress(data.time, durationRef.current || 0);
      }

      if (data.type === "ended") {
        if (currentProps.tmdbType === "tv") {
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
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [iframeRef]);

  return null;
};
