"use client";

import { type AnimeServer } from "@/app/constants/anime";
import { useHistoryStore } from "@/app/store/useHistoryStore";
import { type AniListMediaDetail } from "@/app/types/anilist";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

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

  // Apply Resume Parameters for Vidnest
  if (
    currentServer.id.startsWith("vidnest") &&
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
    const trackProgress = (currentTime: number, duration: number) => {
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
        currentTime,
        duration,
      });
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

      // 1. Handle Vidnest Player Events (MEDIA_DATA)
      if (
        event.origin === "https://vidnest.fun" &&
        data.type === "MEDIA_DATA"
      ) {
        const mediaData = data.data;
        const currentTime = mediaData.currentTime;
        const duration = mediaData.duration;

        if (currentTime !== undefined && duration !== undefined) {
          trackProgress(currentTime, duration);

          // Auto-next on completion
          if (duration > 0 && currentTime >= duration - 1) {
            if (ep < totalCount) {
              console.log(
                "Vidnest complete. Auto-navigating to episode",
                ep + 1,
              );
              navigate(ep + 1);
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
          if (ep < totalCount) {
            console.log(
              "Tryembed complete. Auto-navigating to episode",
              ep + 1,
            );
            navigate(ep + 1);
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
        if (ep < totalCount) {
          console.log("Megaplay complete. Auto-navigating to episode", ep + 1);
          navigate(ep + 1);
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
    return () => window.removeEventListener("message", handleMessage);
  }, [
    id,
    ep,
    totalCount,
    navigate,
    addToHistory,
    initialDetails,
    currentServer.id,
  ]);

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
