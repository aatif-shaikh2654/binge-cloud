"use client";

import { TMDB_IMAGE_BASE_URL } from "@/app/constants/tmdb";
import { type TMDBMovie } from "@/app/types/tmdb";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { CiVolume, CiVolumeHigh, CiVolumeMute } from "react-icons/ci";

interface HeroBackdropProps {
  details: TMDBMovie;
  videoKeys: string[];
}

const HeroBackdrop: React.FC<HeroBackdropProps> = ({ details, videoKeys }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(80); // 0-100
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const videoKey = videoKeys[currentIndex] ?? null;

  // Sync isVideoLoaded reset during render when videoKey changes
  const [prevVideoKey, setPrevVideoKey] = useState(videoKey);
  if (videoKey !== prevVideoKey) {
    setPrevVideoKey(videoKey);
    setIsVideoLoaded(false);
  }

  // --- Post a command to the YT iframe ---
  const postCommand = useCallback((func: string, args: unknown[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*",
    );
  }, []);

  // --- Silently rotate to next video when current one ends ---
  const rotateNext = useCallback(() => {
    if (videoKeys.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % videoKeys.length);
  }, [videoKeys.length]);

  // --- Listen for YouTube postMessage to detect video end ---
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data?.event === "onStateChange" && data?.info === 0) rotateNext();
        if (data?.event === "infoDelivery" && data?.info?.playerState === 0)
          rotateNext();
      } catch {
        // non-JSON messages — ignore
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [rotateNext]);

  // --- Apply volume to iframe ---
  const applyVolume = useCallback(
    (vol: number, muted: boolean) => {
      if (muted) {
        postCommand("mute");
      } else {
        postCommand("unMute");
        postCommand("setVolume", [vol]);
      }
    },
    [postCommand],
  );

  // --- Toggle mute ---
  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    applyVolume(volume, nextMuted);
  }, [isMuted, volume, applyVolume]);

  // --- Change volume (also unmutes if muted) ---
  const changeVolume = useCallback(
    (newVol: number) => {
      const clamped = Math.max(0, Math.min(100, newVol));
      setVolume(clamped);
      const nextMuted = clamped === 0;
      setIsMuted(nextMuted);
      applyVolume(clamped, nextMuted);
    },
    [applyVolume],
  );

  // --- Show slider, auto-hide after 2.5s of inactivity ---
  const revealSlider = useCallback(() => {
    setShowVolumeSlider(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setShowVolumeSlider(false), 2500);
  }, []);

  // --- Cmd+M / Ctrl+M keybinding ---
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
      const modifier = isMac ? e.metaKey : e.ctrlKey;
      if (modifier && e.key.toLowerCase() === "m") {
        e.preventDefault();
        toggleMute();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [toggleMute]);

  // Cleanup hide timer on unmount
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const VolumeIcon =
    isMuted || volume === 0
      ? CiVolumeMute
      : volume < 50
        ? CiVolume
        : CiVolumeHigh;

  return (
    <>
      {/* Cinematic Background Backdrop */}
      <div className="absolute inset-0 w-full h-[58vh] md:h-[80vh] lg:h-screen overflow-hidden bg-background">
        {/* Base Image */}
        {details.backdrop_path || details.poster_path ? (
          <Image
            src={`${TMDB_IMAGE_BASE_URL}/original${details.backdrop_path || details.poster_path}`}
            alt={details.title || details.name || "Backdrop"}
            fill
            sizes="100vw"
            className="object-cover opacity-50 md:opacity-40 blur-none md:blur-[1px] scale-105 animate-in fade-in duration-1000"
            priority
          />
        ) : null}

        {/* Video Layer */}
        {videoKey && (
          <div className="absolute w-full h-full pointer-events-none">
            <iframe
              key={videoKey}
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&loop=0&enablejsapi=1&disablekb=1&iv_load_policy=3&playsinline=1&fs=0&vq=hd1080`}
              className={cn(
                "w-full h-full scale-[2.5] md:scale-[1.8] lg:scale-[1.5] transition-opacity duration-1000",
                isVideoLoaded ? "opacity-100" : "opacity-0",
              )}
              onLoad={() => setIsVideoLoaded(true)}
              allow="autoplay; encrypted-media"
            />
          </div>
        )}

        {/* Dark Overlays */}
        <div className="absolute bottom-0 w-full h-1/2 bg-linear-to-t from-background via-background/30 md:via-background/50 to-transparent" />
      </div>

      {/* Volume Control */}
      {videoKey && (
        <div
          className="absolute md:top-10 md:right-8 top-7 right-6 z-50 flex flex-col items-center gap-2"
          onMouseEnter={revealSlider}
          onMouseLeave={() => {
            if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
            hideTimerRef.current = setTimeout(
              () => setShowVolumeSlider(false),
              800,
            );
          }}
        >
          {/* Mute / Volume icon button */}
          <button
            onClick={() => {
              toggleMute();
              revealSlider();
            }}
            title={`${isMuted ? "Unmute" : "Mute"} (⌘M)`}
            className="size-12 lg:size-14 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-105 hover:border-white/40 active:scale-95"
          >
            <VolumeIcon className="w-5 h-5 lg:w-6 lg:h-6 text-white transition-all duration-200" />
          </button>

          {/* Vertical slider — slides down below button */}
          <div
            className={cn(
              "flex flex-col items-center overflow-hidden transition-all duration-500 ease-in-out",
              showVolumeSlider
                ? "max-h-40 opacity-100 translate-y-0"
                : "max-h-0 opacity-0 -translate-y-1 pointer-events-none",
            )}
          >
            {/* Pill container */}
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                revealSlider();
                changeVolume(Number(e.target.value));
              }}
              className={cn(
                "appearance-none cursor-pointer outline-none focus:outline-none focus-visible:outline-none",
                "w-1.5 h-24",
                "[writing-mode:vertical-lr] [direction:rtl]",
                "[&::-webkit-slider-runnable-track]:rounded-full",
                "[&::-webkit-slider-runnable-track]:bg-white/15",
                "[&::-webkit-slider-thumb]:appearance-none",
                "[&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5",
                "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white",
                "[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150",
                "[&::-webkit-slider-thumb]:hover:scale-125",
                "[&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5",
                "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0",
              )}
              style={{
                background: `linear-gradient(to top, white ${isMuted ? 0 : volume}%, rgba(255,255,255,0.15) ${isMuted ? 0 : volume}%)`,
                borderRadius: "999px",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default HeroBackdrop;
