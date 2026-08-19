"use client";

import { getSeasonDetails } from "@/app/services/all.service";
import { type TMDBSeason } from "@/app/types/tmdb";
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
import { ChevronRight, List, Loader2, Play } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface EpisodeSwitcherProps {
  tvId: number;
  seasons: TMDBSeason[];
  currentSeason: number;
  currentEpisode: number;
  onEpisodeChange: (s: number, e: number) => void;
}

const EpisodeSwitcher: React.FC<EpisodeSwitcherProps> = ({
  tvId,
  seasons,
  currentSeason,
  currentEpisode,
  onEpisodeChange,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(currentSeason);

  const { data, isLoading } = useQuery({
    queryKey: ["episodes", tvId, selectedSeason],
    queryFn: () => getSeasonDetails(tvId, selectedSeason),
    enabled: !!tvId,
  });

  const episodes = data?.episodes || [];

  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open && !isLoading) {
      // Use a slightly longer timeout to ensure Radix Sheet animation and ScrollArea are ready
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
  }, [open, isLoading, selectedSeason, currentEpisode, currentSeason]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "bg-black border-white/10 text-white hover:bg-zinc-900 h-12 px-4 rounded-lg gap-3 shadow-xl hover:border-blue-500/50 transition-all group/btn",
        )}
      >
        <div className="relative">
          <List className="w-5 h-5 text-blue-500 group-hover/btn:scale-110 transition-transform" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
        </div>
        <div className="flex flex-col items-start text-left">
          <span className="font-black uppercase tracking-widest text-[12px] leading-none">
            S{currentSeason} • E{currentEpisode}
          </span>
        </div>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-zinc-950 border-l border-white/10 text-white w-full! md:w-[480px]! p-0 flex flex-col"
      >
        <SheetHeader className="p-6 pb-4 border-b border-white/5 bg-linear-to-b from-white/1 to-transparent shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white text-xl font-black tracking-tighter flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-600/10 rounded-lg border border-blue-500/20">
                <List className="w-4 h-4 text-blue-500" />
              </div>
              Episodes
            </SheetTitle>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 pt-3.5 no-scrollbar">
            {seasons
              .map((season) => (
                <button
                  key={season.id}
                  onClick={() => setSelectedSeason(season.season_number)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] transition-all border active:scale-95 ${
                    selectedSeason === season.season_number
                      ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20"
                      : "bg-zinc-900 border-white/5 text-white/40 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  {season.season_number === 0 ? "Specials" : `Season ${season.season_number}`}
                </button>
              ))}
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 flex flex-col gap-3">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              </div>
            ) : (
              episodes.map((episode) => (
                <button
                  key={episode.id}
                  onClick={() => {
                    onEpisodeChange(selectedSeason, episode.episode_number);
                    setOpen(false);
                  }}
                  ref={
                    currentSeason === selectedSeason &&
                    currentEpisode === episode.episode_number
                      ? activeRef
                      : null
                  }
                  className={`flex items-center gap-3.5 p-2.5 rounded-lg border transition-all duration-300 active:scale-[0.98] group ${
                    currentSeason === selectedSeason &&
                    currentEpisode === episode.episode_number
                      ? "bg-blue-600/80 border-blue-400 text-white shadow-lg shadow-blue-600/20 backdrop-blur-sm"
                      : "bg-black border-white/5 text-white/60 hover:bg-zinc-900 hover:border-white/10 hover:text-white"
                  }`}
                >
                  <div className="relative w-24 h-14 shrink-0 rounded-md overflow-hidden bg-white/5 border border-white/5 group-hover:border-blue-500/30 transition-all duration-500">
                    {episode.still_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                        alt={episode.name}
                        fill
                        sizes="100px"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-600/5">
                        <span className="text-[10px] font-black opacity-20">
                          N/A
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {currentSeason === selectedSeason &&
                      currentEpisode === episode.episode_number && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px]">
                          <Play className="w-5 h-5 fill-white" />
                        </div>
                      )}
                  </div>

                  <div className="flex-1 text-left min-w-0 py-0.5">
                    <p
                      className={cn(
                        "text-[13px] font-bold line-clamp-1 transition-colors duration-300",
                        currentSeason === selectedSeason &&
                          currentEpisode === episode.episode_number
                          ? "text-white"
                          : "group-hover:text-white",
                      )}
                    >
                      {episode.name}
                    </p>
                    <p className="text-[10px] font-medium text-white/30 line-clamp-1 mt-1 uppercase tracking-wider">
                      Episode {episode.episode_number}
                    </p>
                  </div>

                  {!(
                    currentSeason === selectedSeason &&
                    currentEpisode === episode.episode_number
                  ) && (
                    <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0 transition-all duration-300 text-white" />
                  )}
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default EpisodeSwitcher;
