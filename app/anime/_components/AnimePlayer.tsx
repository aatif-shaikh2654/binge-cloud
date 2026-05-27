"use client";

import { type AnimeServer } from "@/app/constants/anime";
import { useHistoryStore } from "@/app/store/useHistoryStore";
import { type AniListMediaDetail } from "@/app/types/anilist";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface AnimePlayerProps {
  id: string;
  ep: number;
  currentServer: AnimeServer;
  totalCount: number;
  navigate: (newEp?: number, newServer?: string) => void;
  initialDetails: AniListMediaDetail;
}

const AnimePlayer: React.FC<AnimePlayerProps> = ({
  id,
  ep,
  currentServer,
  totalCount,
  navigate,
  initialDetails,
}) => {
  const { addToHistory, history } = useHistoryStore();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const latestProgressRef = useRef({ currentTime: 0, duration: 0 });
  const lastSaveTimeRef = useRef(0);

  // Sync props to ref to avoid ESLint rules about refs in render and race conditions
  const propsRef = useRef({
    id,
    ep,
    currentServer,
    initialDetails,
    addToHistory,
    totalCount,
    navigate,
  });
  useEffect(() => {
    propsRef.current = {
      id,
      ep,
      currentServer,
      initialDetails,
      addToHistory,
      totalCount,
      navigate,
    };
  });

  // Reset progress tracking refs when navigating to a new episode/server
  useEffect(() => {
    latestProgressRef.current = { currentTime: 0, duration: 0 };
    lastSaveTimeRef.current = Date.now();
  }, [id, ep, currentServer.id]);

  // Background Image for Loader
  const backdropImage =
    initialDetails.bannerImage ||
    initialDetails.coverImage.extraLarge ||
    initialDetails.coverImage.large ||
    "";

  // Calculate Initial Start Time
  const initialStartTime = useMemo(() => {
    const savedItem = history.find(
      (h) =>
        h.id === Number(id) && h.media_type === "anime" && h.episode === ep,
    );

    if (savedItem?.currentTime && savedItem.currentTime > 10) {
      return Math.floor(savedItem.currentTime);
    }
    return 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, ep, currentServer.id]); // history removed to stabilize videoUrl during playback

  let videoUrl = `${currentServer.baseUrl}/${id}/${ep}/${currentServer.lang}`;

  // Apply Resume Parameters for Server 3 & Server 4 (Vidnest & Vidnest Pahe)
  if (
    (currentServer.id.startsWith("server-3") ||
      currentServer.id.startsWith("server-4")) &&
    initialStartTime !== null &&
    initialStartTime > 0
  ) {
    const separator = videoUrl.includes("?") ? "&" : "?";
    videoUrl += `${separator}progress=${initialStartTime}`;
  }

  // Reset loader when URL changes (Sync state with URL during render)
  const [prevUrl, setPrevUrl] = useState(videoUrl);
  if (videoUrl !== prevUrl) {
    setPrevUrl(videoUrl);
    setIsVideoLoaded(false);
  }

  // Initial History Tracking
  useEffect(() => {
    const title =
      initialDetails.title.english ||
      initialDetails.title.romaji ||
      initialDetails.title.native ||
      "Unknown Anime";
    const poster =
      initialDetails.coverImage.extraLarge ||
      initialDetails.coverImage.large ||
      "";
    const backdrop = initialDetails.bannerImage || poster;

    addToHistory({
      id: Number(id),
      media_type: "anime",
      title,
      poster_path: poster,
      backdrop_path: backdrop,
      server: currentServer.id,
      episode: ep,
      watchedAt: Date.now(),
    });
  }, [id, ep, currentServer.id, addToHistory, initialDetails]);

  // Player Events Listener
  useEffect(() => {
    const trackProgress = (
      currentTime: number,
      duration: number,
      force = false,
    ) => {
      latestProgressRef.current = { currentTime, duration };
      const now = Date.now();

      if (force || now - lastSaveTimeRef.current >= 5 * 60 * 1000) {
        lastSaveTimeRef.current = now;
        const currentProps = propsRef.current;
        const title =
          currentProps.initialDetails.title.english ||
          currentProps.initialDetails.title.romaji ||
          currentProps.initialDetails.title.native ||
          "Unknown Anime";
        const poster =
          currentProps.initialDetails.coverImage.extraLarge ||
          currentProps.initialDetails.coverImage.large ||
          "";
        const backdrop = currentProps.initialDetails.bannerImage || poster;

        currentProps.addToHistory({
          id: Number(currentProps.id),
          media_type: "anime",
          title,
          poster_path: poster,
          backdrop_path: backdrop,
          server: currentProps.currentServer.id,
          episode: currentProps.ep,
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

      // 1. Handle Vidnest Player Events (PLAYER_EVENT and MEDIA_DATA)
      if (event.origin === "https://vidnest.fun") {
        if (data.type === "PLAYER_EVENT") {
          const { currentTime, duration } = data.data || {};
          if (currentTime !== undefined && duration !== undefined) {
            trackProgress(currentTime, duration);

            // Auto-next on completion
            if (duration > 0 && currentTime >= duration - 1) {
              if (currentProps.ep < currentProps.totalCount) {
                currentProps.navigate(currentProps.ep + 1);
              }
            }
          }
        } else if (data.type === "MEDIA_DATA") {
          const mediaData = data.data;

          // Save progress to local storage as requested by docs
          try {
            localStorage.setItem("vidNestProgress", JSON.stringify(mediaData));
          } catch (e) {
            console.error("Failed to save vidNestProgress to localStorage", e);
          }

          let currentTime: number | undefined;
          let duration: number | undefined;

          const episodeKey = `s1e${currentProps.ep}`;
          const episodeKeySimple = `e${currentProps.ep}`;
          const episodeKeyNum = `${currentProps.ep}`;

          const animeProgress =
            mediaData?.[currentProps.id]?.show_progress?.[episodeKey]?.progress ||
            mediaData?.[currentProps.id]?.show_progress?.[episodeKeySimple]?.progress ||
            mediaData?.[currentProps.id]?.show_progress?.[episodeKeyNum]?.progress ||
            mediaData?.show_progress?.[episodeKey]?.progress ||
            mediaData?.show_progress?.[episodeKeySimple]?.progress ||
            mediaData?.show_progress?.[episodeKeyNum]?.progress ||
            mediaData?.[currentProps.id]?.progress ||
            mediaData?.progress;

          if (animeProgress) {
            currentTime = animeProgress.watched;
            duration = animeProgress.duration;
          }

          // Fallback to top-level properties if available directly
          if (currentTime === undefined && duration === undefined && mediaData) {
            currentTime = mediaData.currentTime ?? mediaData.watched;
            duration = mediaData.duration;
          }

          if (currentTime !== undefined && duration !== undefined) {
            trackProgress(currentTime, duration);

            // Auto-next on completion
            if (duration > 0 && currentTime >= duration - 1) {
              if (currentProps.ep < currentProps.totalCount) {
                currentProps.navigate(currentProps.ep + 1);
              }
            }
          }
        }
        return;
      }

      // 2. Handle Tryembed Player Events (PLAYER_EVENT)
      if (data.type === "PLAYER_EVENT") {
        const playerEvent = data.data;
        const eventType = playerEvent.event;
        const currentTime = playerEvent.currentTime;
        const duration = playerEvent.duration;

        // Auto-next on completion
        if (
          eventType === "complete" ||
          (duration > 0 && currentTime >= duration - 1)
        ) {
          if (currentProps.ep < currentProps.totalCount) {
            currentProps.navigate(currentProps.ep + 1);
          }
        }

        // Track progress
        if (currentTime !== undefined && duration !== undefined) {
          trackProgress(currentTime, duration);
        }
        return;
      }

      // 3. Handle Legacy Player Events (Megaplay etc)
      if (data.event === "complete") {
        if (currentProps.ep < currentProps.totalCount) {
          currentProps.navigate(currentProps.ep + 1);
        }
      }

      if (data.type === "watching-log" || data.event === "time") {
        const currentTime = data.currentTime ?? data.time;
        const duration = data.duration;

        if (currentTime !== undefined && duration !== undefined) {
          trackProgress(currentTime, duration);
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

  return (
    <div className="relative w-full h-full">
      {/* Loader overlay */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background">
          {backdropImage && (
            <Image
              src={backdropImage}
              alt="Backdrop"
              fill
              sizes="100vw"
              className="object-cover opacity-20 blur-sm scale-110"
              priority
            />
          )}
          <div className="relative z-20 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-white/60 font-medium animate-pulse">
              Initializing Player...
            </p>
          </div>
        </div>
      )}

      {/* Player */}
      <iframe
        key={videoUrl}
        src={videoUrl}
        className={cn(
          "absolute inset-0 w-full h-full border-none transition-opacity duration-1000",
          isVideoLoaded ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        allowFullScreen
        allow="autoplay; encrypted-media; picture-in-picture"
        onLoad={() => setIsVideoLoaded(true)}
        title={`Anime ${id} — Episode ${ep}`}
        scrolling="no"
      />
    </div>
  );
};

export default AnimePlayer;
