"use client";

import { useWatchNavigation } from "@/features/player/hooks/useWatchNavigation";
import { getMediaDetails } from "@/features/media/services/all.service";
import { getAnimeDetails } from "@/features/anime/services/anilist.service";
import { HistoryItem, useHistoryStore } from "@/features/history/store/useHistoryStore";
import { type AniListMediaDetail } from "@/features/anime/types/anilist";
import { type TMDBMovie } from "@/features/media/types/tmdb";
import { useQuery } from "@tanstack/react-query";
import { Info, Play, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";

interface HistoryCardProps {
  item: HistoryItem;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ item }) => {
  const { removeFromHistory } = useHistoryStore();
  const { handleWatchClick } = useWatchNavigation();

  const isAnime = item.media_type === "anime";
  const isTv = item.media_type === "tv";

  const { data: realTimeDetails } = useQuery({
    queryKey: ["realTimeDetails", item.media_type, item.id],
    queryFn: async () => {
      if (isAnime) {
        return getAnimeDetails(item.id);
      } else if (isTv) {
        return getMediaDetails(item.id, "tv");
      }
      return null;
    },
    enabled: isAnime || isTv,
    staleTime: 5 * 60 * 1000,
  });

  const latestAiredEp = useMemo(() => {
    if (isAnime) {
      const details = realTimeDetails as AniListMediaDetail | null;
      if (details) {
        return details.nextAiringEpisode
          ? `${details.nextAiringEpisode.episode - 1}`
          : `${details.episodes}`;
      }
      return null;
    } else if (isTv) {
      const details = realTimeDetails as TMDBMovie | null;
      if (details?.last_episode_to_air) {
        return `S${details.last_episode_to_air.season_number} E${details.last_episode_to_air.episode_number}`;
      }
      return null;
    }
    return null;
  }, [isAnime, isTv, realTimeDetails]);

  const detailUrl = `/${item.media_type}/detail?id=${item.id}`;

  return (
    <div className="group relative w-full aspect-video rounded-2xl overflow-hidden border border-white/5 bg-white/5 hover:border-blue-500/30 transition-all duration-500">
      <Link
        href={
          item.media_type === "anime"
            ? `/anime/watch?id=${item.id}${item.episode ? `&ep=${item.episode}` : ""}${item.server ? `&server=${item.server}` : ""}`
            : `/${item.media_type}/watch?id=${item.id}${item.server ? `&server=${item.server}` : ""}${item.season ? `&season=${item.season}` : ""}${item.episode ? `&episode=${item.episode}` : ""}`
        }
        onClick={handleWatchClick}
        className="block w-full h-full"
      >
        <Image
          src={
            item.backdrop_path?.startsWith("http") ||
            item.poster_path?.startsWith("http")
              ? item.backdrop_path || item.poster_path
              : `https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`
          }
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
        />

        {latestAiredEp && (
          <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
            <span className="bg-green-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase shadow-md">
              {latestAiredEp.startsWith("S")
                ? latestAiredEp
                : `EP ${latestAiredEp}`}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/20 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] transform scale-75 group-hover:scale-100 transition-transform duration-500">
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-[15px] font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
            {item.title}
          </h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1.5 flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/60">
              {item.media_type === "tv"
                ? "TV"
                : item.media_type === "anime"
                  ? "Anime"
                  : "Movie"}
            </span>
            {item.media_type === "tv" && (
              <span>
                S{item.season} • E{item.episode}
              </span>
            )}
            {item.media_type === "anime" && item.episode && (
              <span>EP {item.episode}</span>
            )}
            {item.currentTime && item.duration && (
              <span className="text-blue-400/80 font-bold">
                • {Math.round((item.currentTime / item.duration) * 100)}%
              </span>
            )}
          </p>
        </div>

        {item.currentTime && item.duration && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(0, (item.currentTime / item.duration) * 100))}%`,
              }}
            />
          </div>
        )}
      </Link>

      <Link
        href={detailUrl}
        className="absolute top-3 right-12 p-2 bg-blue-600/90 backdrop-blur-md rounded-full text-white hover:bg-blue-500 hover:scale-110 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10 border border-blue-400/50 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
        title="View Details"
      >
        <Info className="w-3.5 h-3.5" />
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          removeFromHistory(item.id, item.media_type);
        }}
        className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-full text-white/40 hover:text-white hover:bg-red-500/80 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10 border border-white/10 shadow-lg"
        title="Remove from History"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default HistoryCard;
