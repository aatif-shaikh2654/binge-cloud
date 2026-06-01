"use client";

import { FORMAT_LABEL, STATUS_LABEL } from "@/app/constants/anilist";
import { useWatchNavigation } from "@/app/hooks/useWatchNavigation";
import { useHistoryStore } from "@/app/store/useHistoryStore";
import { useWatchlistStore } from "@/app/store/useWatchlistStore";
import { type AniListMediaDetail } from "@/app/types/anilist";
import { type MediaType } from "@/app/types/common";
import ZoomableImage from "@/components/common/ZoomableImage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bookmark, ChevronDown, ChevronUp, Play, Plus, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { toast } from "sonner";

interface AnimeDetailHeroProps {
  details: AniListMediaDetail;
}

const AnimeDetailHero: React.FC<AnimeDetailHeroProps> = ({ details }) => {
  const { handleWatchClick } = useWatchNavigation();
  const { toggleWatchlist, isInWatchlist } = useWatchlistStore();
  const history = useHistoryStore((state) => state.history);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const tmdbType: MediaType = "anime";
  const inWatchlist = isInWatchlist(details.id, tmdbType);

  const historyItem = history.find(
    (h) => h.id === Number(details.id) && h.media_type === "anime",
  );

  const isResumable = !!historyItem;

  const handleWatchlistToggle = () => {
    toggleWatchlist({
      ...details,
      media_type: tmdbType,
      title: title,
    });
    if (inWatchlist) {
      toast.error(`Removed from Watchlist`);
    } else {
      toast.success(`Added to Watchlist`);
    }
  };

  const title =
    details.title.english ||
    details.title.romaji ||
    details.title.native ||
    "Unknown";
  const score =
    details.averageScore != null
      ? (details.averageScore / 10).toFixed(1)
      : null;
  const format = details.format
    ? (FORMAT_LABEL[details.format] ?? details.format)
    : null;
  const status = details.status
    ? (STATUS_LABEL[details.status] ?? details.status)
    : null;
  const studio = details.studios?.nodes[0]?.name ?? null;
  const cleanDescription = details.description
    ? details.description.replace(/<[^>]*>/g, "")
    : null;

  const bgImage =
    details.bannerImage ||
    details.coverImage.extraLarge ||
    details.coverImage.large;
  const posterImage = details.coverImage.extraLarge || details.coverImage.large;

  const aired = (() => {
    const s = details.startDate;
    if (!s?.year) return null;
    const parts = [s.year, s.month, s.day].filter(Boolean);
    return parts.join("-");
  })();

  const watchUrl = isResumable
    ? `/anime/watch?id=${details.id}${
        historyItem.episode ? `&ep=${historyItem.episode}` : ""
      }${historyItem.server ? `&server=${historyItem.server}` : ""}`
    : `/anime/watch?id=${details.id}`;

  const resumeText = isResumable
    ? `Resume Ep ${historyItem.episode}`
    : "Watch Now";

  return (
    <>
      {/* Cinematic backdrop */}
      <div className="absolute inset-0 w-full h-[50vh] overflow-hidden">
        {bgImage ? (
          <Image
            src={bgImage}
            alt={title}
            fill
            sizes="100vw"
            className="object-cover object-top opacity-60 animate-in fade-in duration-1000"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-20 pt-62 lg:pt-98 flex flex-col items-start text-left lg:flex-row gap-8 lg:gap-20">
        {/* Poster */}
        <div className="w-42 md:w-58 shrink-0 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8)] transition-all duration-700 hover:scale-[1.02] hover:border-white/20 group">
            {posterImage && (
              <ZoomableImage
                src={posterImage}
                alt={title}
                fill
                sizes="256px"
                imageClassName="object-cover group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 max-w-3xl space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200 fill-mode-backwards">
          <div className="space-y-3 md:space-y-5">
            {/* Badges row */}
            <div className="flex flex-wrap items-center justify-start gap-3">
              {score && (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 text-[10px] font-black uppercase tracking-wider">
                  <Star className="w-3 h-3 fill-green-500" />
                  {score} / 10
                </div>
              )}
              {details.seasonYear && (
                <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                  {details.seasonYear}
                </span>
              )}
              {format && (
                <span className="text-white/60 text-[10px] font-black tracking-widest px-1.5 py-0.5 border border-white/10 rounded">
                  {format}
                </span>
              )}
              {status && (
                <span
                  className={cn(
                    "text-[10px] font-black tracking-widest px-1.5 py-0.5 border rounded",
                    details.status === "RELEASING"
                      ? "border-green-500/30 text-green-400"
                      : "border-white/10 text-white/60",
                  )}
                >
                  {status}
                </span>
              )}
              {details.episodes != null && (
                <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                  {details.episodes} eps
                </span>
              )}
              {details.duration != null && (
                <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                  {details.duration}m / ep
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.05] drop-shadow-2xl text-white/95">
              {title}
            </h1>

            {/* Native / romaji subtitle */}
            {details.title.native && details.title.english && (
              <p className="text-lg md:text-xl font-medium text-white/50 italic leading-relaxed">
                {details.title.romaji}
              </p>
            )}

            {/* Genres */}
            <div className="flex flex-wrap items-center justify-start gap-x-2 gap-y-1">
              {details.genres.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-full border border-white/20 bg-white/5 text-[9px] lg:text-[10px] font-black text-white/90 tracking-tight"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-start gap-3">
            <Link onClick={handleWatchClick} href={watchUrl}>
              <Button
                variant={isResumable ? "premiumBlue" : "premium"}
                size="xl"
                className="h-12 text-sm px-6 lg:text-base lg:h-12 lg:px-6"
              >
                {isResumable ? (
                  <Play className="w-4 h-4 lg:w-5 lg:h-5 fill-current" />
                ) : (
                  <FaPlay fill="#000" className="w-4 h-4 lg:w-5 lg:h-5" />
                )}
                {resumeText}
              </Button>
            </Link>
            <Button
              variant={inWatchlist ? "premium" : "glass"}
              size="icon-xl"
              className={cn(
                "size-11 lg:size-12 transition-all duration-300",
                inWatchlist && "bg-white text-black hover:bg-white/90",
              )}
              onClick={handleWatchlistToggle}
            >
              {inWatchlist ? (
                <Bookmark className="w-4 h-4 lg:w-5 lg:h-5 fill-black" />
              ) : (
                <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
              )}
            </Button>
          </div>

          {/* Storyline */}
          {cleanDescription && (
            <div className="space-y-3 max-w-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center justify-start gap-3">
                Storyline
                <div className="h-px flex-1 bg-white/10 hidden lg:block" />
              </h3>
              <p
                className={cn(
                  "text-sm md:text-lg text-white/80 leading-relaxed font-medium transition-all duration-300",
                  isDescExpanded ? "" : "line-clamp-4"
                )}
              >
                {cleanDescription}
              </p>
              {cleanDescription.length > 250 && (
                <button
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                  className="flex items-center gap-1.5 text-blue-500 hover:text-blue-400 font-extrabold text-sm transition-colors cursor-pointer"
                >
                  {isDescExpanded ? (
                    <>
                      Show Less <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Read More <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Extra metadata */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2 border-t border-white/5">
            {studio && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">
                  Studio
                </p>
                <p className="text-sm font-bold text-white/80">{studio}</p>
              </div>
            )}
            {details.source && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">
                  Source
                </p>
                <p className="text-sm font-bold text-white/80 capitalize">
                  {details.source.replace(/_/g, " ").toLowerCase()}
                </p>
              </div>
            )}
            {aired && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">
                  Aired
                </p>
                <p className="text-sm font-bold text-white/80">{aired}</p>
              </div>
            )}
            {details.countryOfOrigin && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">
                  Country
                </p>
                <p className="text-sm font-bold text-white/80">
                  {details.countryOfOrigin}
                </p>
              </div>
            )}
            {details.popularity != null && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">
                  Popularity
                </p>
                <p className="text-sm font-bold text-white/80">
                  #{details.popularity.toLocaleString()}
                </p>
              </div>
            )}
            {details.episodes != null && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">
                  Total Episodes
                </p>
                <p className="text-sm font-bold text-white/80">
                  {details.episodes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AnimeDetailHero;
