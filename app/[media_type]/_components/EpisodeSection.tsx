"use client";

import { TMDB_IMAGE_BASE_URL } from "@/app/constants/tmdb";
import { useWatchNavigation } from "@/app/hooks/useWatchNavigation";
import { getSeasonDetails } from "@/app/services/all.service";
import { useHistoryStore } from "@/app/store/useHistoryStore";
import { TMDBEpisode, type TMDBSeason } from "@/app/types/tmdb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, Play, Star, Tv2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";

interface EpisodeSectionProps {
  tvId: number;
  seasons: TMDBSeason[];
  nextEpisodeToAir?: {
    episode_number: number;
    season_number: number;
    air_date: string;
    name: string;
  } | null;
}

const EpisodeSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="group relative rounded-lg overflow-hidden border border-white/5 bg-zinc-900 flex flex-row md:flex-col animate-pulse"
      >
        <Skeleton className="aspect-video w-32 sm:w-40 md:w-full shrink-0 bg-white/5" />
        <div className="p-3 md:p-5 flex-1 flex flex-col justify-center gap-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-10" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <div className="flex gap-4 mt-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const EpisodeSection: React.FC<EpisodeSectionProps> = ({
  tvId,
  seasons,
  nextEpisodeToAir,
}) => {
  const params = useParams();
  const { history } = useHistoryStore();
  const { handleWatchClick } = useWatchNavigation();

  const formatTMDBAiringDate = (airDateString: string) => {
    const date = new Date(airDateString);
    if (isNaN(date.getTime())) return airDateString;
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const historyItem = history.find(
    (h) => h.id === tvId && h.media_type === "tv",
  );

  const [selectedSeason, setSelectedSeason] = useState(() => {
    if (historyItem?.season) return historyItem.season;
    if (!seasons || seasons.length === 0) return 1;
    const firstSeason = seasons.find((s) => s.season_number > 0);
    return firstSeason
      ? firstSeason.season_number
      : seasons[0]?.season_number || 1;
  });

  const [prevHistorySeason, setPrevHistorySeason] = useState(
    historyItem?.season,
  );
  if (historyItem?.season !== prevHistorySeason) {
    setPrevHistorySeason(historyItem?.season);
    if (historyItem?.season) {
      setSelectedSeason(historyItem.season);
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ["episodes", tvId, selectedSeason],
    queryFn: () => getSeasonDetails(tvId, selectedSeason),
    enabled: !!tvId,
  });

  const mediaType = params.media_type as string;
  const episodes = data?.episodes || [];
  const watchUrl = (episode: TMDBEpisode) => {
    return `/${mediaType}/watch?id=${tvId}&season=${selectedSeason}&episode=${episode.episode_number}`;
  };

  return (
    <div className="mt-12 md:mt-24 space-y-8 md:space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-4 md:pb-6 gap-4 md:gap-6">
        <div className="space-y-1 md:space-y-2">
          <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-blue-500">
            Episodes
          </h3>
          <h2 className="text-2xl md:text-5xl font-black tracking-tighter">
            Seasons & Stories
          </h2>
          {nextEpisodeToAir && (
            <div className="flex lg:mt-2 items-center gap-2.5 px-4 py-2.5 rounded-[10px] border border-blue-500/20 bg-blue-500/5 text-xs md:text-sm font-semibold text-blue-400 mt-2.5 w-fit">
              <Calendar className="w-4 h-4 text-blue-400 shrink-0 animate-pulse" />
              <span>
                Next episode (S{nextEpisodeToAir.season_number} EP {nextEpisodeToAir.episode_number}
                {nextEpisodeToAir.name ? `: ${nextEpisodeToAir.name}` : ""}) airing{" "}
                <span className="text-white font-bold">
                  {formatTMDBAiringDate(nextEpisodeToAir.air_date)}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Season Selector */}
        <div className="flex flex-wrap gap-2">
          <Select
            value={`${selectedSeason} Season`}
            onValueChange={(value) =>
              setSelectedSeason(parseInt(value as string))
            }
          >
            <SelectTrigger className="w-[180px] bg-black border-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] h-11 rounded-full px-6 transition-all hover:bg-zinc-900 hover:border-blue-500/30 shadow-lg">
              <SelectValue placeholder="Select Season" />
            </SelectTrigger>
            <SelectContent
              side="bottom"
              align="end"
              sideOffset={12}
              className="bg-zinc-950 border-white/10 shadow-2xl rounded-xl p-1 overflow-hidden"
            >
              {seasons.map((season) => (
                <SelectItem
                  key={season.id}
                  value={`${season.season_number} Season`}
                  className="text-[10px] font-black uppercase tracking-widest data-[highlighted]:bg-white data-[highlighted]:text-black! data-[highlighted]:**:text-black! py-3 px-6 transition-all duration-300 rounded-lg cursor-pointer"
                >
                  {season.season_number} Season
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <EpisodeSkeleton />
      ) : episodes.length === 0 ? (
        <div className="relative group overflow-hidden border border-white/5 bg-zinc-950 rounded-[2rem] p-12 md:p-24 text-center space-y-6 animate-in fade-in zoom-in-95 duration-700 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />
          <div className="relative space-y-6">
            <div className="inline-flex p-5 md:p-8 bg-zinc-900 rounded-[2rem] border border-white/10 group-hover:border-blue-500/50 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
              <Tv2 className="w-10 h-10 md:w-16 md:h-16 text-blue-500" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl md:text-4xl font-black tracking-tighter text-white">
                Episodes Incoming
              </h3>
              <p className="text-white/40 text-xs md:text-base max-w-md mx-auto font-medium leading-relaxed">
                We couldn&apos;t find any episodes for Season {selectedSeason}{" "}
                yet. Our servers are syncing with TMDB to bring you the latest
                content.
              </p>
            </div>
            <div className="flex justify-center pt-4">
              <div className="px-6 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                Season {selectedSeason} • Empty
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {episodes.map((episode, index) => {
            const isCurrentlyWatching =
              historyItem?.season === selectedSeason &&
              historyItem?.episode === episode.episode_number;

            return (
              <Link
                key={episode.id}
                href={watchUrl(episode)}
                onClick={handleWatchClick}
                className={cn(
                  "group relative rounded-lg md:rounded-xl overflow-hidden border transition-all duration-300 animate-in fade-in slide-in-from-bottom-10 flex flex-row md:flex-col shadow-xl hover:shadow-blue-600/5",
                  isCurrentlyWatching
                    ? "bg-blue-600/80 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)] backdrop-blur-sm"
                    : "bg-black border-white/5 hover:border-blue-500/50 hover:bg-zinc-900",
                )}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "backwards",
                }}
              >
                {/* Episode Image */}
                <div className="relative aspect-video w-32 sm:w-40 md:w-full overflow-hidden shrink-0">
                  {episode.still_path ? (
                    <Image
                      src={`${TMDB_IMAGE_BASE_URL}/w500${episode.still_path}`}
                      alt={episode.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                      <Play className="w-8 h-8 md:w-12 md:h-12 text-white/5" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "absolute inset-0 transition-opacity flex items-center justify-center",
                      isCurrentlyWatching
                        ? "bg-blue-600/20 opacity-100"
                        : "bg-black/40 opacity-0 group-hover:opacity-100",
                    )}
                  >
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-3 h-3 md:w-5 md:h-5 fill-white text-white ml-0.5 md:ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 px-1.5 py-0.5 md:px-2 md:py-1 bg-black/80 backdrop-blur-md rounded text-[8px] md:text-[10px] font-black uppercase border border-white/10">
                    EP {episode.episode_number}
                  </div>

                  {isCurrentlyWatching && (
                    <div className="absolute top-2 left-2 md:top-3 md:left-3 px-2 py-1 bg-white text-blue-600 rounded text-[8px] font-black uppercase tracking-widest shadow-lg">
                      Watching
                    </div>
                  )}
                </div>

                {/* Episode Info */}
                <div className="p-3 md:p-5 flex-1 flex flex-col justify-center min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={cn(
                        "text-xs md:text-sm font-black transition-colors line-clamp-1",
                        isCurrentlyWatching
                          ? "text-white"
                          : "text-white group-hover:text-blue-500",
                      )}
                    >
                      {episode.name}
                    </h4>
                    <div className="flex items-center gap-1 text-green-500 text-[8px] md:text-[10px] font-black shrink-0">
                      <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-green-500" />
                      {(episode.vote_average * 10).toFixed(0)}%
                    </div>
                  </div>
                  <p className="hidden md:line-clamp-2 text-[10px] md:text-xs text-white/40 font-medium leading-relaxed mt-1 md:mt-2">
                    {episode.overview ||
                      "No description available for this episode."}
                  </p>
                  <div className="flex items-center gap-3 md:gap-4 mt-2 md:mt-3">
                    <div
                      className={cn(
                        "flex items-center gap-1 md:gap-1.5 text-[8px] md:text-[10px] font-bold uppercase tracking-widest",
                        isCurrentlyWatching ? "text-white/70" : "text-white/30",
                      )}
                    >
                      <Clock className="w-2.5 h-2.5 md:w-3 md:h-3" />
                      {episode.runtime || 0}m
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-1 md:gap-1.5 text-[8px] md:text-[10px] font-bold uppercase tracking-widest",
                        isCurrentlyWatching ? "text-white/70" : "text-white/30",
                      )}
                    >
                      <Calendar className="w-2.5 h-2.5 md:w-3 md:h-3" />
                      {episode.air_date
                        ? new Date(episode.air_date).getFullYear()
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EpisodeSection;
