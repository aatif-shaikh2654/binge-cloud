"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type TMDBSeason } from "@/app/types/tmdb";
import { getSeasonDetails } from "@/app/services/all.service";
import { TMDB_IMAGE_BASE_URL } from "@/app/constants/tmdb";
import Image from "next/image";
import { Play, Clock, Star, Loader2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface EpisodeSectionProps {
  tvId: number;
  seasons: TMDBSeason[];
}

const EpisodeSection: React.FC<EpisodeSectionProps> = ({ tvId, seasons }) => {
  const [selectedSeason, setSelectedSeason] = useState(() => {
    if (!seasons || seasons.length === 0) return 1;
    const firstSeason = seasons.find((s) => s.season_number > 0);
    return firstSeason ? firstSeason.season_number : seasons[0]?.season_number || 1;
  });

  const { data, isLoading } = useQuery({
    queryKey: ["episodes", tvId, selectedSeason],
    queryFn: () => getSeasonDetails(tvId, selectedSeason),
    enabled: !!tvId,
  });

  const episodes = data?.episodes || [];

  return (
    <div className="mt-24 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-6 gap-6">
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-blue-500">
            Episodes
          </h3>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">
            Seasons & Stories
          </h2>
        </div>

        {/* Season Selector */}
        <div className="flex flex-wrap gap-2">
          {seasons.map((season) => (
            <button
              key={season.id}
              onClick={() => setSelectedSeason(season.season_number)}
              className={cn(
                "px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border",
                selectedSeason === season.season_number
                  ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  : "bg-white/5 text-white/40 border-white/10 hover:border-white/30 hover:text-white"
              )}
            >
              Season {season.season_number}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {episodes.map((episode, index) => (
            <div
              key={episode.id}
              className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 animate-in fade-in slide-in-from-bottom-10"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
            >
              {/* Episode Image */}
              <div className="relative aspect-video w-full overflow-hidden">
                {episode.still_path ? (
                  <Image
                    src={`${TMDB_IMAGE_BASE_URL}/w500${episode.still_path}`}
                    alt={episode.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white/10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-5 h-5 fill-white text-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-black">
                  EP {episode.episode_number}
                </div>
              </div>

              {/* Episode Info */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-white group-hover:text-blue-500 transition-colors line-clamp-1">
                    {episode.name}
                  </h4>
                  <div className="flex items-center gap-1 text-green-500 text-[10px] font-black">
                    <Star className="w-3 h-3 fill-green-500" />
                    {(episode.vote_average * 10).toFixed(0)}%
                  </div>
                </div>
                <p className="text-xs text-white/40 line-clamp-2 font-medium leading-relaxed">
                  {episode.overview || "No description available for this episode."}
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-1.5 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    {episode.runtime || 0}m
                  </div>
                  <div className="flex items-center gap-1.5 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                    <Calendar className="w-3 h-3" />
                    {episode.air_date ? new Date(episode.air_date).getFullYear() : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EpisodeSection;
