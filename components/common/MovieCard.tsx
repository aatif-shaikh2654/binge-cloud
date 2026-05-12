"use client";

import { TMDB_IMAGE_BASE_URL } from "@/app/constants/tmdb";
import { getMovieVideos } from "@/app/services/all.service";
import { MediaType } from "@/app/types/common";
import { type TMDBMovie } from "@/app/types/tmdb";
import { Button } from "@/components/ui/button";
import { useWatchlistStore } from "@/lib/store/useWatchlistStore";
import { usePlayerStore } from "@/lib/store/usePlayerStore";
import { cn } from "@/lib/utils";
import { Bookmark, Plus, Star, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { toast } from "sonner";

interface MovieCardProps {
  movie: TMDBMovie;
  mediaType?: MediaType;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, mediaType }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showHoverCard, setShowHoverCard] = useState(false);
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const { isMuted, setIsMuted } = usePlayerStore();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toggleWatchlist, isInWatchlist } = useWatchlistStore();

  useEffect(() => {
    if (iframeRef.current && isVideoLoaded) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: isMuted ? "mute" : "unMute",
          args: [],
        }),
        "*",
      );
    }
  }, [isMuted, isVideoLoaded]);

  const inWatchlist = isInWatchlist(movie.id, movie.media_type);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist(movie);
    if (inWatchlist) {
      toast.error(`Removed from Watchlist`);
    } else {
      toast.success(`Added to Watchlist`);
    }
  };

  const rating = (movie.vote_average * 10).toFixed(0);
  const releaseYear = new Date(
    movie.release_date || movie.first_air_date || "",
  ).getFullYear();

  const handleMouseEnter = () => {
    setIsHovered(true);
    hoverTimeoutRef.current = setTimeout(async () => {
      setShowHoverCard(true);
      if (!videoKey) {
        const type = movie.media_type === "tv" ? "tv" : "movie";
        const videos = await getMovieVideos(movie.id, type);
        const trailer =
          videos.results?.find(
            (v: { type: string; site: string; key: string }) =>
              v.type === "Trailer" && v.site === "YouTube",
          ) || videos.results?.[0];
        if (trailer) setVideoKey(trailer.key);
      }
    }, 600);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowHoverCard(false);
    setIsVideoLoaded(false);
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  };

  const currentMediaType = useMemo(() => {
    if (mediaType) return mediaType;
    if (movie.media_type) return movie.media_type;
    return "movie";
  }, [mediaType, movie.media_type]);

  const watchUrl = `/${currentMediaType}/watch?id=${movie.id}`;
  const detailUrl = `/${currentMediaType}/detail?id=${movie.id}`;

  return (
    <div
      className={cn(
        "relative w-full transition-all duration-300",
        isHovered || showHoverCard ? "z-[150]" : "z-10",
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Base Card */}
      <Link
        href={detailUrl}
        className="group flex flex-col gap-3 cursor-pointer"
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-white/5 bg-white/5 transition-all duration-500 group-hover:border-white/20">
          <Image
            src={`${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`}
            alt={movie.title || movie.name || "Movie Poster"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/40 backdrop-blur-[2px] z-20">
            <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.6)] transform scale-50 group-hover:scale-100 transition-all duration-500 ease-out">
              <FaPlay className="text-white text-xl ml-1" />
            </div>
          </div>
          <div className="absolute top-3 left-3 flex items-center">
            <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-wider uppercase">
              {currentMediaType === "tv" ? "TV" : "Movie"}
            </span>
          </div>
          <div className="absolute top-3 right-3 flex items-center">
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-md px-2 py-1 flex items-center gap-1">
              <Star className="w-3 h-3 text-green-500 fill-green-500" />
              <span className="text-[10px] font-black text-green-500">
                {rating}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-0.5 px-1">
          <h3 className="text-sm font-bold text-white line-clamp-1">
            {movie.title || movie.name}
          </h3>
          <p className="text-[11px] font-medium text-white/40 tracking-tight">
            {releaseYear} • {currentMediaType === "tv" ? "TV Series" : "Movie"}
          </p>
        </div>
      </Link>

      {/* Hover Card Overlay */}
      {showHoverCard && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] bg-card rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[200] animate-in zoom-in-95 duration-200"
          style={{ transformOrigin: "center" }}
        >
          {/* Video Section */}
          <div className="relative aspect-video h-[200px] overflow-hidden flex items-center justify-center w-full bg-background">
            {videoKey ? (
              <>
                {!isVideoLoaded && (
                  <Image
                    src={`${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path || movie.poster_path}`}
                    alt="Preview"
                    fill
                    sizes="380px"
                    className="object-cover blur-md scale-110 transition-opacity duration-500"
                  />
                )}
                <iframe
                  ref={iframeRef}
                  src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&loop=1&playlist=${videoKey}&enablejsapi=1`}
                  className={cn(
                    "w-full h-full scale-[1.35] transition-opacity duration-500",
                    isVideoLoaded ? "opacity-100" : "opacity-0",
                  )}
                  onLoad={() => setIsVideoLoaded(true)}
                  allow="autoplay"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMuted(!isMuted);
                  }}
                  className="absolute bottom-4 right-4 z-30 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              </>
            ) : (
              <Image
                src={`${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path || movie.poster_path}`}
                alt="Preview"
                fill
                sizes="380px"
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          </div>

          {/* Content Section */}
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href={watchUrl}>
                  <Button variant="premium" size="sm" className="gap-2 px-3">
                    <FaPlay className="w-3! h-3!" />
                    Play Now
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

            <Link href={detailUrl}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-500 font-black text-xs uppercase tracking-wider">
                  {rating}% Match
                </span>
                <span className="text-white/40 text-[10px] font-bold border border-white/10 px-1.5 py-0.5 rounded uppercase">
                  {releaseYear}
                </span>
              </div>
              <h3 className="text-lg font-black text-white leading-tight mb-2">
                {movie.title || movie.name}
              </h3>
              <p className="text-white/60 text-xs line-clamp-3 leading-relaxed font-medium">
                {movie.overview}
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
