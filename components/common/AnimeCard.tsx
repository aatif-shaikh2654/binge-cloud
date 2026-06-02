"use client";

import { FORMAT_LABEL, STATUS_LABEL } from "@/app/constants/anilist";
import { useWatchNavigation } from "@/app/hooks/useWatchNavigation";
import { useHistoryStore } from "@/app/store/useHistoryStore";
import { useWatchlistStore } from "@/app/store/useWatchlistStore";
import { type AniListMedia } from "@/app/types/anilist";
import { type MediaType } from "@/app/types/common";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bookmark, Play, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { toast } from "sonner";

interface AnimeCardProps {
  anime: AniListMedia;
  badge?: string;
  disableHoverCard?: boolean;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, disableHoverCard }) => {
  const [isHovered, setIsHovered] = useState(false);

  const { toggleWatchlist, isInWatchlist } = useWatchlistStore();
  const { handleWatchClick } = useWatchNavigation();
  const history = useHistoryStore((state) => state.history);

  const tmdbType: MediaType = "anime";
  const inWatchlist = isInWatchlist(anime.id, tmdbType);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist({
      ...anime,
      media_type: tmdbType,
      title:
        anime.title.english ||
        anime.title.romaji ||
        anime.title.native ||
        "Unknown",
    });
    if (inWatchlist) {
      toast.error(`Removed from Watchlist`);
    } else {
      toast.success(`Added to Watchlist`);
    }
  };

  const title =
    anime.title.english ||
    anime.title.romaji ||
    anime.title.native ||
    "Unknown";
  const format = anime.format
    ? (FORMAT_LABEL[anime.format] ?? anime.format)
    : null;
  const status = anime.status
    ? (STATUS_LABEL[anime.status] ?? anime.status)
    : null;
  const year = anime.seasonYear;

  const historyItem = history.find(
    (h) => h.id === Number(anime.id) && h.media_type === "anime",
  );

  const isResumable = !!historyItem;

  const watchUrl = isResumable
    ? `/anime/watch?id=${anime.id}${
        historyItem.episode ? `&ep=${historyItem.episode}` : ""
      }${historyItem.server ? `&server=${historyItem.server}` : ""}`
    : `/anime/watch?id=${anime.id}`;

  const resumeText = isResumable
    ? `Resume Ep ${historyItem.episode}`
    : "Play Now";

  const coverSrc = anime.coverImage.extraLarge || anime.coverImage.large;

  const latestEpisode = anime.nextAiringEpisode
    ? anime.nextAiringEpisode.episode - 1
    : anime.episodes;

  return (
    <div
      className={cn(
        "relative w-full transition-all duration-300",
        isHovered ? "z-[150]" : "z-10",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/anime/detail?id=${anime.id}`}
        className="group flex flex-col gap-3 cursor-pointer"
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-white/5 bg-white/5 transition-all duration-500 group-hover:border-white/20">
          {coverSrc ? (
            <Image
              src={coverSrc}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
              <span className="text-white/20 text-xs">No Image</span>
            </div>
          )}

          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/40 backdrop-blur-[2px] z-20">
            <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.6)] transform scale-50 group-hover:scale-100 transition-all duration-500 ease-out">
              <FaPlay className="text-white text-xl ml-1" />
            </div>
          </div>

          {/* Latest Episode Badge */}
          {latestEpisode != null && latestEpisode > 0 && (
            <div className="absolute top-2 left-3">
              <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-wider uppercase">
                EP {latestEpisode}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-0.5 px-1">
          <h3 className="text-sm font-bold text-white line-clamp-1">{title}</h3>
          <p className="text-[11px] font-medium text-white/40 tracking-tight">
            {[year, status].filter(Boolean).join(" • ")}
          </p>
        </div>
      </Link>

      {/* Hover detail card */}
      {isHovered && !disableHoverCard && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] bg-card rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[300] animate-in zoom-in-95 duration-200"
          style={{ transformOrigin: "center" }}
        >
          {/* Banner / cover preview */}
          <Link
            href={`/anime/detail?id=${anime.id}`}
            className="relative h-[200px] block overflow-hidden"
          >
            <Image
              src={anime.bannerImage || coverSrc || ""}
              alt={title}
              fill
              sizes="320px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

            {latestEpisode != null && latestEpisode > 0 && (
              <div className="absolute top-2.5 left-3 z-30">
                <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-wider uppercase">
                  EP {latestEpisode}
                </span>
              </div>
            )}
          </Link>

          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href={watchUrl} onClick={handleWatchClick}>
                  <Button
                    variant={isResumable ? "premiumBlue" : "premium"}
                    size="sm"
                    className="gap-2 px-3"
                  >
                    {isResumable ? (
                      <Play className="w-3! h-3! fill-current" />
                    ) : (
                      <FaPlay className="w-3! h-3!" />
                    )}
                    {resumeText}
                  </Button>
                </Link>
                <Button
                  variant={inWatchlist ? "premium" : "glass"}
                  size="icon-sm"
                  className={cn(
                    "size-9",
                    inWatchlist && "bg-white text-black hover:bg-white/90",
                  )}
                  onClick={handleWatchlistToggle}
                >
                  {inWatchlist ? (
                    <Bookmark className="w-3! h-3! fill-black" />
                  ) : (
                    <Plus className="w-3! h-3!" />
                  )}
                </Button>
              </div>
            </div>
            <Link
              href={`/anime/detail?id=${anime.id}`}
              className="block cursor-pointer! space-y-3"
            >
              <div className="flex items-center gap-2 flex-wrap">
                {anime.averageScore != null && (
                  <span className="text-green-500 font-black text-xs uppercase tracking-wider">
                    {anime.averageScore}% Score
                  </span>
                )}
                {year && (
                  <span className="text-white/40 text-[10px] font-bold border border-white/10 px-1.5 py-0.5 rounded uppercase">
                    {year}
                  </span>
                )}
                {format && (
                  <span className="text-white/40 text-[10px] font-bold border border-white/10 px-1.5 py-0.5 rounded uppercase">
                    {format}
                  </span>
                )}
              </div>

              <h3 className="text-base font-black text-white leading-tight truncate hover:text-blue-500 transition-colors">
                {title}
              </h3>

              {anime.genres.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {anime.genres.slice(0, 3).map((g) => (
                    <span
                      key={g}
                      className="uppercase text-[9px] lg:text-[10px] border border-white/15 font-black text-white/60 px-1.5 py-0.5 rounded tracking-wider bg-white/[0.02]"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeCard;
