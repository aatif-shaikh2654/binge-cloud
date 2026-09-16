"use client";
import { TMDB_IMAGE_BASE_URL } from "@/features/media/constants/tmdb";
import { useWatchNavigation } from "@/features/player/hooks/useWatchNavigation";
import { getMovieVideos } from "@/features/media/services/all.service";
import { useHistoryStore } from "@/features/history/store/useHistoryStore";
import { useWatchlistStore } from "@/features/watchlist/store/useWatchlistStore";
import { type MediaType } from "@/shared/types/common";
import { type TMDBMovie } from "@/features/media/types/tmdb";
import ZoomableImage from "@/shared/components/feedback/ZoomableImage";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  Play,
  Plus,
  Star,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { toast } from "sonner";
import HeroBackdrop from "./HeroBackdrop";
import GenreBadge from "@/features/media/components/GenreBadge";

interface DetailHeroProps {
  details: TMDBMovie;
  tmdbType: MediaType;
}

const DetailHero: React.FC<DetailHeroProps> = ({ details, tmdbType }) => {
  const { toggleWatchlist, isInWatchlist } = useWatchlistStore();
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const { handleWatchClick } = useWatchNavigation();
  const history = useHistoryStore((state) => state.history);

  const [videoKeys, setVideoKeys] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchVideo = async () => {
      try {
        const type = tmdbType === "tv" ? "tv" : "movie";
        const videos = await getMovieVideos(details.id, type);
        const youtubeVideos: { type: string; site: string; key: string }[] =
          videos.results?.filter(
            (v: { type: string; site: string; key: string }) =>
              v.site === "YouTube",
          ) || [];
        // Prioritise trailers, then teasers, then anything else
        const sorted = [
          ...youtubeVideos.filter((v) => v.type === "Trailer"),
          ...youtubeVideos.filter((v) => v.type === "Teaser"),
          ...youtubeVideos.filter(
            (v) => v.type !== "Trailer" && v.type !== "Teaser",
          ),
        ];
        if (sorted.length > 0 && isMounted) {
          setVideoKeys(sorted.map((v) => v.key));
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };
    fetchVideo();
    return () => {
      isMounted = false;
    };
  }, [details.id, tmdbType]);

  const inWatchlist = isInWatchlist(details.id, tmdbType);

  const historyItem = history.find(
    (h) => h.id === details.id && h.media_type === tmdbType,
  );

  const isResumable = !!historyItem;

  const handleWatchlistToggle = () => {
    toggleWatchlist({
      ...details,
      media_type: tmdbType,
      title: details.title || details.name,
    });
    if (inWatchlist) {
      toast.error(`Removed from Watchlist`);
    } else {
      toast.success(`Added to Watchlist`);
    }
  };
  const releaseYear = new Date(
    details?.release_date || details?.first_air_date || "",
  ).getFullYear();
  const rating = details?.vote_average ? details.vote_average.toFixed(1) : "0";
  const runtime = details?.runtime || details?.episode_run_time?.[0] || 0;

  const watchUrl = isResumable
    ? `/${tmdbType}/watch?id=${details.id}${
        historyItem.server ? `&server=${historyItem.server}` : ""
      }${historyItem.season ? `&season=${historyItem.season}` : ""}${
        historyItem.episode ? `&episode=${historyItem.episode}` : ""
      }`
    : `/${tmdbType}/watch?id=${details.id}`;

  const resumeText = isResumable
    ? tmdbType === "tv"
      ? `Resume S${historyItem.season} E${historyItem.episode}`
      : "Resume Watching"
    : "Watch Now";

  return (
    <>
      <HeroBackdrop details={details} videoKeys={videoKeys} />
      {/* Hero Section: Poster & Main Info */}
      <div className="relative z-10 container mx-auto px-6 lg:px-20 pt-[45vh] md:pt-[60vh] lg:pt-[642px] flex flex-col items-start text-left lg:flex-row gap-8 lg:gap-20 min-h-[75vh] md:min-h-[90vh] lg:min-h-[95vh] pb-10">
        {/* Mute Button (Top Right) */}

        {/* Poster - More subtle animation */}
        <div className="w-32 md:w-48 lg:w-64 shrink-0 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <div className="relative aspect-2/3 w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8)] transition-all duration-700 hover:scale-[1.02] hover:border-white/20 group">
            {details.poster_path && (
              <ZoomableImage
                src={`${TMDB_IMAGE_BASE_URL}/w500${details.poster_path}`}
                originalImageSrc={`${TMDB_IMAGE_BASE_URL}/original${details.poster_path}`}
                alt={details.title || details.name || "Poster"}
                fill
                sizes="256px"
                imageClassName="object-cover group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Info Content - staggered feel with slide-up */}
        <div className="flex-1 max-w-3xl space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200 fill-mode-backwards w-full">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-start gap-3">
              {rating && parseFloat(rating) > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-500 text-[10px] font-black uppercase tracking-wider">
                  <Star className="w-3 h-3 fill-yellow-500" />
                  {rating}
                </div>
              )}
              {!isNaN(releaseYear) && (
                <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                  {releaseYear}
                </span>
              )}
              <span className="text-white/60 text-[10px] font-black tracking-widest px-1.5 py-0.5 border border-white/10 rounded">
                {tmdbType === "movie" ? "Movie" : "TV"}
              </span>
              {runtime > 0 && (
                <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                  {runtime}m
                </span>
              )}
            </div>

            {/* Reduced Font Sizes */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black! tracking-tight leading-[1.05] drop-shadow-2xl text-white/95">
              {details.title || details.name}
            </h1>

            {details.tagline && (
              <p className="text-lg md:text-xl font-medium text-white/60 italic max-w-2xl leading-relaxed">
                {details.tagline}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-start gap-2">
              {details.genres?.map((genre) => {
                const genreSlug = genre.name.toLowerCase().replace(/\s+/g, "-");
                const pathType = tmdbType === "movie" ? "movie" : "series";
                return (
                  <GenreBadge
                    key={genre.id}
                    name={genre.name}
                    href={`/${pathType}/${genreSlug}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Action Buttons - Slightly smaller */}
          <div className="flex flex-wrap items-center justify-start gap-3">
            <Link href={watchUrl} onClick={handleWatchClick}>
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

          {details.overview && (
            <div className="space-y-3 max-w-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center justify-start gap-3">
                Storyline
                <div className="h-px flex-1 bg-white/10 hidden lg:block" />
              </h3>
              <p
                className={cn(
                  "text-sm md:text-lg text-white/80 leading-relaxed font-medium transition-all duration-300",
                  isDescExpanded ? "" : "line-clamp-4",
                )}
              >
                {details.overview}
              </p>
              {details.overview.length > 250 && (
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
        </div>
      </div>
    </>
  );
};

export default DetailHero;
