"use client";

import { type AniListMedia } from "@/features/anime/types/anilist";
import { Clock, Play, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface AnimeSearchCardProps {
  anime: AniListMedia;
}

const AnimeSearchCard: React.FC<AnimeSearchCardProps> = ({ anime }) => {
  const title =
    anime.title.english ||
    anime.title.romaji ||
    anime.title.native ||
    "Unknown";

  const score = anime.averageScore != null ? `${anime.averageScore}%` : "N/A";
  const year = anime.seasonYear;
  const episodes = anime.episodes;
  const coverSrc = anime.coverImage.large || anime.coverImage.extraLarge;

  return (
    <Link
      href={`/anime/detail?id=${anime.id}`}
      className="group relative flex items-center gap-4 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative w-20 h-24 sm:h-28 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={coverSrc || ""}
          alt={title}
          fill
          sizes="80px"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="w-6 h-6 text-white fill-current" />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 min-w-0 gap-1.5">
        <div className="flex items-center gap-2">
          {score !== "N/A" && (
            <div className="flex items-center gap-1 text-[10px] font-black text-green-500">
              <Star className="w-3 h-3 fill-current" />
              <span>{score}</span>
            </div>
          )}
          {year && (
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
              {year}
            </span>
          )}
        </div>

        <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
          {title}
        </h3>

        <div className="flex items-center gap-3 mt-auto">
          {episodes && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30">
              <Clock className="w-3 h-3" />
              <span>{episodes} Episodes</span>
            </div>
          )}
          {anime.format && (
            <span className="text-[9px] font-black text-blue-500/80 bg-blue-500/10 px-1.5 py-0.5 rounded uppercase tracking-tighter border border-blue-500/20">
              {anime.format}
            </span>
          )}
        </div>
      </div>

      {/* Trending Indicator */}
      {anime.trending && anime.trending > 100 ? (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.8)] animate-pulse" />
        </div>
      ) : null}
    </Link>
  );
};

export default AnimeSearchCard;
