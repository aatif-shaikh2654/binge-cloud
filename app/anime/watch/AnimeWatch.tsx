"use client";

import AnimeEpisodeSwitcher from "@/app/[media_type]/_components/AnimeEpisodeSwitcher";
import { cn } from "@/lib/utils";
import { ArrowLeft, Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const MEGAPLAY_BASE = "https://megaplay.buzz/stream/ani";

type Lang = "sub" | "dub";

interface AnimeWatchProps {
  id: string;
}

const AnimeWatch: React.FC<AnimeWatchProps> = ({ id }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const ep = Math.max(1, Number(searchParams.get("ep")) || 1);
  const lang = (searchParams.get("lang") as Lang) || "sub";

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const videoUrl = `${MEGAPLAY_BASE}/${id}/${ep}/${lang}`;

  const [prevUrl, setPrevUrl] = useState(videoUrl);
  if (videoUrl !== prevUrl) {
    setPrevUrl(videoUrl);
    setIsVideoLoaded(false);
  }

  const navigate = (newEp?: number, newLang?: Lang) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newEp !== undefined) params.set("ep", newEp.toString());
    if (newLang !== undefined) params.set("lang", newLang);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-background">
      {/* Back */}
      <button
        onClick={() => router.push(`/anime/detail?id=${id}`)}
        className="absolute top-6 left-6 z-[100] p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/20 transition-all group"
      >
        <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
      </button>

      {/* Controls — top right */}
      <div className="absolute top-6 right-6 z-[100] flex items-center gap-2">
        {/* Sub / Dub toggle */}
        <div className="flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          {(["sub", "dub"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => navigate(undefined, l)}
              className={cn(
                "px-4 h-11 text-[10px] font-black uppercase tracking-widest transition-all",
                lang === l
                  ? "bg-blue-600 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/10",
              )}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Episode switcher sheet */}
        <AnimeEpisodeSwitcher
          animeId={id}
          currentEp={ep}
          onEpisodeChange={(newEp) => navigate(newEp)}
        />
      </div>

      {/* Loader overlay */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
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

export default AnimeWatch;
