"use client";

import { TMDB_IMAGE_BASE_URL } from "@/app/constants/tmdb";
import { useWatchNavigation } from "@/app/hooks/useWatchNavigation";
import { getMovieVideos } from "@/app/services/all.service";
import { useHistoryStore } from "@/app/store/useHistoryStore";
import { usePlayerStore } from "@/app/store/usePlayerStore";
import { useWatchlistStore } from "@/app/store/useWatchlistStore";
import { MediaType, UnifiedMediaItem } from "@/app/types/common";
import { TMDBMovie } from "@/app/types/tmdb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  BookmarkMinus,
  Play,
  Plus,
  Star,
  Volume2,
  VolumeX,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getAnimeDetails } from "@/app/services/anilist.service";
import { getMediaDetails } from "@/app/services/all.service";
import { type AniListMediaDetail } from "@/app/types/anilist";

interface MovieCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  movie: TMDBMovie | UnifiedMediaItem | any;
  mediaType?: MediaType;
  rank?: number;
  isWatchLaterPage?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  mediaType,
  rank,
  isWatchLaterPage,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showHoverCard, setShowHoverCard] = useState(false);
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const { isMuted, setIsMuted } = usePlayerStore();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toggleWatchlist, isInWatchlist } = useWatchlistStore();
  const { handleWatchClick } = useWatchNavigation();
  const history = useHistoryStore((state) => state.history);
  const router = useRouter();

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

  const currentMediaType = useMemo(() => {
    if (mediaType) return mediaType;
    if (movie.media_type) return movie.media_type;
    return "movie";
  }, [mediaType, movie.media_type]);

  const isAnime = currentMediaType === "anime";
  const isTv = currentMediaType === "tv";

  const { data: realTimeDetails } = useQuery({
    queryKey: ["realTimeDetails", currentMediaType, movie.id],
    queryFn: async () => {
      if (isAnime) {
        return getAnimeDetails(movie.id);
      } else if (isTv) {
        return getMediaDetails(movie.id, "tv");
      }
      return null;
    },
    enabled: !!isWatchLaterPage && (isAnime || isTv),
    staleTime: 5 * 60 * 1000,
  });

  const latestAiredEp = useMemo(() => {
    if (!isWatchLaterPage) return null;
    if (currentMediaType === "anime") {
      const details = realTimeDetails as AniListMediaDetail | null;
      if (details) {
        return details.nextAiringEpisode
          ? `EP ${details.nextAiringEpisode.episode - 1}`
          : `EP ${details.episodes}`;
      }
      // fallback to stored data
      return movie.nextAiringEpisode
        ? `EP ${movie.nextAiringEpisode.episode - 1}`
        : movie.episodes
          ? `EP ${movie.episodes}`
          : null;
    } else if (currentMediaType === "tv") {
      const details = realTimeDetails as TMDBMovie | null;
      if (details?.last_episode_to_air) {
        return `S${details.last_episode_to_air.season_number} E${details.last_episode_to_air.episode_number}`;
      }
      return null;
    }
    return null;
  }, [currentMediaType, realTimeDetails, movie, isWatchLaterPage]);

  const inWatchlist = isInWatchlist(movie.id, currentMediaType);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist({ ...movie, media_type: currentMediaType });
    if (inWatchlist) {
      toast.error(`Removed from Watchlist`);
    } else {
      toast.success(`Added to Watchlist`);
    }
  };

  const rating = useMemo(() => {
    if (movie.vote_average !== undefined) {
      return (movie.vote_average * 10).toFixed(0);
    }
    const score = movie.averageScore as number | undefined;
    if (score !== undefined && score !== null) {
      return score.toFixed(0);
    }
    return "0";
  }, [movie]);

  const releaseYear = useMemo(() => {
    if (currentMediaType === "anime") {
      return (
        (movie.seasonYear as number) ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (movie.startDate as any)?.year ||
        "N/A"
      ).toString();
    }
    const date =
      (movie.release_date as string) || (movie.first_air_date as string);
    if (!date) return "N/A";
    const year = new Date(date).getFullYear();
    return isNaN(year) ? "N/A" : year.toString();
  }, [movie, currentMediaType]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (isWatchLaterPage) return;

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

  const historyItem = history.find(
    (h) => h.id === movie.id && h.media_type === currentMediaType,
  );

  const isResumable = !!historyItem;

  const watchUrl = useMemo(() => {
    if (!isResumable) {
      return currentMediaType === "anime"
        ? `/${currentMediaType}/watch?id=${movie.id}`
        : `/${currentMediaType}/watch?id=${movie.id}`;
    }

    if (currentMediaType === "anime") {
      return `/anime/watch?id=${movie.id}${
        historyItem.episode ? `&ep=${historyItem.episode}` : ""
      }${historyItem.server ? `&server=${historyItem.server}` : ""}`;
    }

    // Movies/TV
    return `/${currentMediaType}/watch?id=${movie.id}${
      historyItem.server ? `&server=${historyItem.server}` : ""
    }${historyItem.season ? `&season=${historyItem.season}` : ""}${
      historyItem.episode ? `&episode=${historyItem.episode}` : ""
    }`;
  }, [isResumable, historyItem, movie.id, currentMediaType]);

  const resumeText = useMemo(() => {
    if (!isResumable) return "Play Now";
    if (currentMediaType === "movie") return "Resume Watching";
    if (currentMediaType === "tv")
      return `Resume S${historyItem.season} E${historyItem.episode}`;
    if (currentMediaType === "anime") return `Resume Ep ${historyItem.episode}`;
    return "Resume";
  }, [isResumable, historyItem, currentMediaType]);

  const detailUrl = `/${currentMediaType}/detail?id=${movie.id}`;

  return (
    <div
      className={cn(
        "relative w-full transition-all duration-300",
        isHovered || showHoverCard ? "z-[500]" : "z-10",
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Base Card Wrapper */}
      <div className="group flex flex-col gap-3 relative">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-white/5 bg-white/5 transition-all duration-500 group-hover:border-white/20">
          {/* Poster Image Link */}
          <Link
            href={detailUrl}
            className="absolute inset-0 z-10 cursor-pointer"
          >
            <Image
              src={
                currentMediaType === "anime"
                  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (movie.coverImage as any)?.extraLarge ||
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (movie.coverImage as any)?.large ||
                    movie.poster_path ||
                    ""
                  : `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`
              }
              alt={movie.title || movie.name || "Movie Poster"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </Link>

          {/* Play Button Overlay (Desktop only when on Watch Later page) */}
          <div
            className={cn(
              "absolute inset-0 items-center justify-center gap-3 transition-all duration-500 z-20 pointer-events-none",
              isWatchLaterPage
                ? "hidden md:flex md:opacity-0 md:group-hover:opacity-100 bg-black/40 backdrop-blur-[2px]"
                : "flex opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-[2px]",
            )}
          >
            <div
              className="w-14 h-14 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.6)] transform scale-50 group-hover:scale-100 transition-all duration-500 ease-out cursor-pointer pointer-events-auto"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleWatchClick();
                router.push(watchUrl);
              }}
            >
              <FaPlay className="text-white text-xl ml-1" />
            </div>
            {isWatchLaterPage && (
              <div
                className="w-14 h-14 bg-white/20 hover:bg-red-600/90 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.4)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] transform scale-50 group-hover:scale-100 transition-all duration-500 ease-out cursor-pointer pointer-events-auto"
                onClick={handleWatchlistToggle}
                title="Remove from Watch Later"
              >
                <BookmarkMinus className="text-white text-2xl" />
              </div>
            )}
          </div>

          {/* Mobile Play Button overlay (Bottom Right) */}
          {isWatchLaterPage && (
            <div className="absolute bottom-3 right-3 flex md:hidden items-center z-20">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleWatchClick();
                  router.push(watchUrl);
                }}
                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)] cursor-pointer active:scale-90 transition-transform"
              >
                <FaPlay className="text-white text-[10px] ml-0.5" />
              </button>
            </div>
          )}

          {isWatchLaterPage && latestAiredEp && (
            <div className="absolute bottom-3 right-3 md:right-3 max-md:right-13 z-20 pointer-events-none">
              <span className="bg-green-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase shadow-md">
                {latestAiredEp}
              </span>
            </div>
          )}

          <div className="absolute top-3 left-3 flex items-center z-20 pointer-events-none">
            <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-wider uppercase">
              {currentMediaType}
            </span>
          </div>
          <div className="absolute top-3 right-3 flex items-center z-20">
            {isWatchLaterPage ? (
              <>
                {/* Desktop: Rating Badge */}
                <div className="hidden md:flex bg-black/60 backdrop-blur-md border border-white/10 rounded-md px-2 py-1 items-center gap-1 pointer-events-none">
                  <Star className="w-3 h-3 text-green-500 fill-green-500" />
                  <span className="text-[10px] font-black text-green-500">
                    {rating}%
                  </span>
                </div>
                {/* Mobile: Remove Button */}
                <button
                  onClick={handleWatchlistToggle}
                  className="flex md:hidden bg-red-500 backdrop-blur-md border border-white/15 rounded-md p-1.5 items-center justify-center cursor-pointer active:scale-90 transition-transform"
                  title="Remove from Watch Later"
                >
                  <BookmarkMinus className="w-3.5 h-3.5 text-white" />
                </button>
              </>
            ) : (
              <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-md px-2 py-1 flex items-center gap-1 pointer-events-none">
                <Star className="w-3 h-3 text-green-500 fill-green-500" />
                <span className="text-[10px] font-black text-green-500">
                  {rating}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Rank Number Overlay - Moved outside overflow-hidden */}
        {rank && (
          <div
            className={cn(
              "absolute -top-5 -left-3 z-[540] pointer-events-none drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-transform duration-300",
              (isHovered || showHoverCard) &&
                "scale-110 -translate-x-2 -translate-y-2",
            )}
          >
            <span
              className="text-7xl font-black text-transparent select-none leading-none inline-block transform"
              style={{
                WebkitTextStroke: "2.5px rgba(255, 255, 255, 0.8)",
                filter: "drop-shadow(0 0 10px rgba(255,255,255,0.2))",
              }}
            >
              {rank}
            </span>
          </div>
        )}

        {/* Title and metadata block wrapped in its own Link */}
        <Link
          href={detailUrl}
          className="flex flex-col gap-0.5 px-1 z-10 cursor-pointer"
        >
          <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-blue-500 transition-colors">
            {movie.title || movie.name}
          </h3>
          <p className="text-[11px] font-medium text-white/40 tracking-tight">
            {releaseYear} • {currentMediaType}
            {isWatchLaterPage && latestAiredEp && ` • Latest: ${latestAiredEp}`}
          </p>
        </Link>
      </div>

      {/* Hover Card Overlay */}
      {showHoverCard && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] bg-card rounded-xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.9)] z-[550] animate-in zoom-in-95 duration-200 border border-white/10"
          style={{ transformOrigin: "center" }}
        >
          {/* Video Section */}
          <div className="relative aspect-video h-[200px] overflow-hidden flex items-center justify-center w-full bg-background">
            {videoKey ? (
              <>
                {!isVideoLoaded && (
                  <Image
                    src={
                      currentMediaType === "anime"
                        ? movie.bannerImage ||
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (movie.coverImage as any)?.extraLarge ||
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (movie.coverImage as any)?.large ||
                          ""
                        : `${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path || movie.poster_path}`
                    }
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
                src={
                  currentMediaType === "anime"
                    ? movie.bannerImage ||
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (movie.coverImage as any)?.extraLarge ||
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (movie.coverImage as any)?.large ||
                      ""
                    : `${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path || movie.poster_path}`
                }
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

            <Link href={detailUrl}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-500 font-black text-xs uppercase tracking-wider">
                  {rating}% Match
                </span>
                <span className="text-white/40 text-[10px] font-bold border border-white/10 px-1.5 py-0.5 rounded uppercase">
                  {releaseYear}
                </span>
                <span className="uppercase text-[10px] border border-blue-500/50 font-black text-blue-500 px-1.5 py-0.5 rounded">
                  {mediaType}
                </span>
              </div>
              <h3 className="text-lg font-black text-white leading-tight truncate mb-2">
                {movie.title || movie.name}
              </h3>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
