"use client";

import { getAnimeDetails } from "@/app/services/anilist.service";
import { type AniListMediaDetail } from "@/app/types/anilist";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { List, Play } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  buildEpisodeMap,
  resolveEpisodeCount,
} from "./AnimeEpisodeSectionContent";

const CHUNK_SIZE = 100;

interface AnimeEpisodeSwitcherProps {
  animeId: string;
  currentEp: number;
  onEpisodeChange: (ep: number) => void;
  initialDetails?: AniListMediaDetail;
}

const EpisodeSkeleton = () => (
  <div className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-zinc-900/50 animate-pulse">
    <div className="w-10 h-10 rounded-lg bg-white/5 shrink-0" />
    <div className="flex-1 min-w-0 space-y-2">
      <div className="h-2 w-16 bg-white/10 rounded" />
      <div className="h-4 w-3/4 bg-white/5 rounded" />
    </div>
  </div>
);

const AnimeEpisodeSwitcher: React.FC<AnimeEpisodeSwitcherProps> = ({
  animeId,
  currentEp,
  onEpisodeChange,
  initialDetails,
}) => {
  const [open, setOpen] = useState(false);

  const { data: details, isLoading } = useQuery({
    queryKey: ["animeDetails", animeId],
    queryFn: () => getAnimeDetails(animeId),
    initialData: initialDetails,
    staleTime: 5 * 60 * 1000,
  });

  const streamingEpisodes = details?.streamingEpisodes ?? [];
  const totalCount = details
    ? resolveEpisodeCount(
        details.episodes,
        details.nextAiringEpisode,
        streamingEpisodes.length,
      )
    : 0;

  const episodeMap = buildEpisodeMap(streamingEpisodes);
  const chunkCount = Math.ceil(totalCount / CHUNK_SIZE);

  const initialChunk = Math.floor((currentEp - 1) / CHUNK_SIZE);
  const [activeChunk, setActiveChunk] = useState(initialChunk);

  const chunkStart = activeChunk * CHUNK_SIZE + 1;
  const chunkEnd = Math.min(chunkStart + CHUNK_SIZE - 1, totalCount);
  const episodes =
    totalCount > 0
      ? Array.from(
          { length: chunkEnd - chunkStart + 1 },
          (_, i) => chunkStart + i,
        )
      : [];

  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open && !isLoading) {
      const timer = setTimeout(() => {
        if (activeRef.current) {
          activeRef.current.scrollIntoView({
            behavior: "instant",
            block: "center",
          });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [open, isLoading, activeChunk, currentEp]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "bg-black border-white/10 text-white hover:bg-zinc-900 h-11 px-4 rounded-lg gap-3 shadow-xl hover:border-blue-500/50 transition-all group/btn",
        )}
      >
        <div className="relative">
          <List className="w-4 h-4 text-blue-500 group-hover/btn:scale-110 transition-transform" />
          <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-blue-500 rounded-full" />
        </div>
        <span className="font-black uppercase tracking-widest text-[11px]">
          EP {currentEp}
        </span>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="bg-zinc-950 border-l border-white/10 text-white w-full! md:w-[480px]! p-0 flex flex-col"
      >
        <SheetHeader className="p-6 pb-4 border-b border-white/5 bg-gradient-to-b from-white/[0.01] to-transparent shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white text-xl font-black tracking-tighter flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-600/10 rounded-lg border border-blue-500/20">
                <List className="w-4 h-4 text-blue-500" />
              </div>
              Episodes
              {totalCount > 0 && (
                <span className="text-white/20 font-black text-lg ml-1">
                  {totalCount}
                </span>
              )}
            </SheetTitle>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 pt-3.5 no-scrollbar">
            {Array.from({ length: chunkCount }, (_, i) => {
              const start = i * CHUNK_SIZE + 1;
              const end = Math.min(start + CHUNK_SIZE - 1, totalCount);
              const isActiveChunk = activeChunk === i;
              return (
                <button
                  key={i}
                  onClick={() => setActiveChunk(i)}
                  className={cn(
                    "shrink-0 px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] transition-all border active:scale-95",
                    isActiveChunk
                      ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20"
                      : "bg-zinc-900 border-white/5 text-white/40 hover:text-white hover:bg-zinc-800",
                  )}
                >
                  {start}–{end}
                </button>
              );
            })}
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 flex flex-col gap-2">
            {isLoading && !details ? (
              Array.from({ length: 12 }).map((_, i) => (
                <EpisodeSkeleton key={i} />
              ))
            ) : episodes.length > 0 ? (
              episodes.map((epNum) => {
                const epData = episodeMap.get(epNum);
                const rawTitle = epData?.title ?? null;
                const cleanTitle = rawTitle
                  ? rawTitle.replace(/^Episode\s+\d+\s*[-–—]\s*/i, "").trim() ||
                    null
                  : null;
                const isActive = currentEp === epNum;

                return (
                  <button
                    key={epNum}
                    onClick={() => {
                      onEpisodeChange(epNum);
                      setOpen(false);
                    }}
                    ref={isActive ? activeRef : null}
                    className={cn(
                      "flex items-center gap-3.5 p-3.5 rounded-lg border transition-all duration-300 text-left active:scale-[0.98] group",
                      isActive
                        ? "bg-blue-600/80 border-blue-400 text-white shadow-lg shadow-blue-600/20 backdrop-blur-sm"
                        : "bg-black border-white/5 text-white/60 hover:bg-zinc-900 hover:border-white/10 hover:text-white",
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-black border transition-all duration-300",
                        isActive
                          ? "bg-white/10 border-white/20 text-white"
                          : "bg-zinc-800 border-white/5 text-white/40 group-hover:border-white/20 group-hover:bg-zinc-700",
                      )}
                    >
                      {isActive ? (
                        <Play className="w-3.5 h-3.5 fill-white" />
                      ) : (
                        epNum
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-[11px] font-black uppercase tracking-widest",
                          isActive ? "text-blue-400" : "text-white/30",
                        )}
                      >
                        Episode {epNum}
                      </p>
                      {cleanTitle && (
                        <p className="text-sm font-bold line-clamp-1 mt-0.5">
                          {cleanTitle}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-white/20">
                <List className="w-12 h-12 mb-4 opacity-10" />
                <p className="text-sm font-black uppercase tracking-widest">
                  No Episodes Found
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default AnimeEpisodeSwitcher;
