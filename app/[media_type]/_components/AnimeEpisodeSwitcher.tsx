"use client";

import { getAnimeDetails } from "@/app/services/anilist.service";
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
import React, { useState } from "react";
import {
  buildEpisodeMap,
  resolveEpisodeCount,
} from "./AnimeEpisodeSectionContent";

const CHUNK_SIZE = 100;

interface AnimeEpisodeSwitcherProps {
  animeId: string;
  currentEp: number;
  onEpisodeChange: (ep: number) => void;
}

const AnimeEpisodeSwitcher: React.FC<AnimeEpisodeSwitcherProps> = ({
  animeId,
  currentEp,
  onEpisodeChange,
}) => {
  const [open, setOpen] = useState(false);

  const { data: details } = useQuery({
    queryKey: ["animeDetails", animeId],
    queryFn: () => getAnimeDetails(animeId),
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
      ? Array.from({ length: chunkEnd - chunkStart + 1 }, (_, i) => chunkStart + i)
      : [];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "bg-blue-600/10 backdrop-blur-md border-blue-500/30 text-white hover:bg-blue-600/20 h-11 px-4 rounded-xl gap-3 shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:border-blue-500/60 transition-all group/btn",
        )}
      >
        <div className="relative">
          <List className="w-4 h-4 text-blue-400 group-hover/btn:scale-110 transition-transform" />
          <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
        </div>
        <span className="font-black uppercase tracking-widest text-[11px]">
          EP {currentEp}
        </span>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="bg-sidebar/85 backdrop-blur-xl border-white/5 text-white w-full! md:w-[480px]! p-0 flex flex-col"
      >
        <SheetHeader className="p-6 border-b border-white/5 shrink-0">
          <SheetTitle className="text-white text-lg font-black tracking-tight flex items-center gap-2">
            <List className="w-5 h-5 text-blue-500" />
            Episodes
            {totalCount > 0 && (
              <span className="text-white/30 font-black text-base ml-1">
                {totalCount}
              </span>
            )}
          </SheetTitle>

          {chunkCount > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 pt-3 no-scrollbar">
              {Array.from({ length: chunkCount }, (_, i) => {
                const start = i * CHUNK_SIZE + 1;
                const end = Math.min(start + CHUNK_SIZE - 1, totalCount);
                return (
                  <button
                    key={i}
                    onClick={() => setActiveChunk(i)}
                    className={cn(
                      "shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border",
                      activeChunk === i
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "bg-white/5 border-white/10 text-white/40 hover:text-white",
                    )}
                  >
                    {start}–{end}
                  </button>
                );
              })}
            </div>
          )}
        </SheetHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 flex flex-col gap-2">
            {episodes.map((epNum) => {
              const epData = episodeMap.get(epNum);
              const rawTitle = epData?.title ?? null;
              const cleanTitle = rawTitle
                ? rawTitle.replace(/^Episode\s+\d+\s*[-–—]\s*/i, "").trim() || null
                : null;
              const isActive = currentEp === epNum;

              return (
                <button
                  key={epNum}
                  onClick={() => {
                    onEpisodeChange(epNum);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 text-left group",
                    isActive
                      ? "bg-blue-600/20 border-blue-500/50 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                      : "bg-white/2 border-white/5 text-white/60 hover:bg-white/5 hover:border-white/10 hover:text-white",
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-black border transition-all",
                      isActive
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "bg-white/5 border-white/10 text-white/40 group-hover:border-white/20",
                    )}
                  >
                    {isActive ? <Play className="w-3.5 h-3.5 fill-white" /> : epNum}
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
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default AnimeEpisodeSwitcher;
