"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type TMDBSeason } from "@/app/types/tmdb";
import { getSeasonDetails } from "@/app/services/all.service";
import { List, ChevronRight, Play, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button
          variant="outline"
          className="bg-blue-600/10 backdrop-blur-md border-blue-500/30 text-white hover:bg-blue-600/20 h-12 px-4 rounded-xl gap-3 shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:border-blue-500/60 transition-all group/btn"
        >
          <div className="relative">
            <List className="w-5 h-5 text-blue-400 group-hover/btn:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="font-black uppercase tracking-widest text-[12px] leading-none">
              S{currentSeason} • E{currentEpisode}
            </span>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-sidebar/95 backdrop-blur-xl border-white/5 text-white w-full sm:max-w-[320px] p-0 flex flex-col"
      >
        <SheetHeader className="p-6 border-b border-white/5">
          <SheetTitle className="text-white text-lg font-black tracking-tight flex items-center gap-2">
            <List className="w-5 h-5 text-blue-500" />
            Episodes
          </SheetTitle>

          <div className="flex gap-2 overflow-x-auto pb-2 pt-4 no-scrollbar">
            {seasons
              .filter((s) => s.season_number > 0)
              .map((season) => (
                <button
                  key={season.id}
                  onClick={() => setSelectedSeason(season.season_number)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
                    selectedSeason === season.season_number
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                  }`}
                >
                  Season {season.season_number}
                </button>
              ))}
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-4 flex flex-col gap-2">
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
                  className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 group ${
                    currentSeason === selectedSeason &&
                    currentEpisode === episode.episode_number
                      ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="text-[10px] font-black opacity-40 w-6">
                    {episode.episode_number}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-xs font-bold line-clamp-1">
                      {episode.name}
                    </p>
                  </div>
                  {currentSeason === selectedSeason &&
                  currentEpisode === episode.episode_number ? (
                    <Play className="w-3 h-3 fill-white" />
                  ) : (
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
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
