"use client";

import { TMDB_GENRES, TMDB_IMAGE_BASE_URL } from "@/app/constants/tmdb";
import { useWatchNavigation } from "@/app/hooks/useWatchNavigation";
import { useTVFocus } from "@/app/tv/useTVFocus";
import { useTVMode } from "@/app/tv/TVModeContext";
import { useHistoryStore } from "@/app/store/useHistoryStore";
import { useWatchlistStore } from "@/app/store/useWatchlistStore";
import { type TMDBMovie } from "@/app/types/tmdb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bookmark, Calendar, Play, Plus, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";
import { toast } from "sonner";
import type { Swiper as SwiperType } from "swiper";
import GenreBadge from "@/components/common/GenreBadge";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import { MediaType } from "@/app/types/common";
import "swiper/css";
import "swiper/css/effect-fade";

interface HerosectionProps {
  movies: TMDBMovie[];
}

// ─── TV hero thumbnail (D-pad focusable) ─────────────────────────────────────

function TVHeroThumb({
  movie,
  index,
  isActive,
  onSelect,
}: {
  movie: TMDBMovie;
  index: number;
  isActive: boolean;
  onSelect: () => void;
}) {
  const { isTVMode } = useTVMode();
  const { focusProps, isFocused } = useTVFocus({
    id: `hero-thumb-${movie.id}-${index}`,
    group: 1,
    onFocus: onSelect, // slide to this movie when focused
  });

  return (
    <div
      {...(focusProps as React.HTMLAttributes<HTMLDivElement>)}
      ref={focusProps.ref as React.RefObject<HTMLDivElement>}
      onClick={onSelect}
      className={cn(
        "tv-hero-thumb relative w-20 aspect-video rounded-md overflow-hidden cursor-pointer transition-all duration-300 border",
        isActive
          ? "border-white! scale-110 z-10"
          : "border-white/10 opacity-50 hover:opacity-100",
        isTVMode && isFocused && "border-white! opacity-100 scale-[1.12]",
      )}
    >
      <Image
        src={`${TMDB_IMAGE_BASE_URL}/w300${movie.backdrop_path}`}
        alt={movie.title || movie.name || "Thumbnail"}
        fill
        sizes="80px"
        className="object-cover"
      />
    </div>
  );
}


const Herosection: React.FC<HerosectionProps> = ({ movies }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const { toggleWatchlist, isInWatchlist } = useWatchlistStore();
  const { handleWatchClick } = useWatchNavigation();
  const history = useHistoryStore((state) => state.history);

  if (!movies || movies.length === 0) return null;

  const displayMovies = movies.slice(0, 6);

  const detailUrl = (movie: TMDBMovie) =>
    `/${movie.media_type}/detail/?id=${movie.id}`;

  const handleWatchlistToggle = (movie: TMDBMovie) => {
    const isAdded = isInWatchlist(movie.id, movie.media_type as MediaType);
    toggleWatchlist({ ...movie, media_type: movie.media_type as MediaType });
    if (isAdded) {
      toast.error(`Removed from Watchlist`);
    } else {
      toast.success(`Added to Watchlist`);
    }
  };

  return (
    <section className="relative w-full h-[85vh] lg:h-screen overflow-hidden group bg-background">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        speed={800}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="h-full w-full hero-slider"
      >
        {displayMovies.map((movie) => {
          const inWatchlist = isInWatchlist(
            movie.id,
            movie.media_type as MediaType,
          );

          const historyItem = history.find(
            (h) => h.id === movie.id && h.media_type === movie.media_type,
          );

          const isResumable = !!historyItem;

          const movieWatchUrl = isResumable
            ? `/${movie.media_type}/watch?id=${movie.id}${
                historyItem.server ? `&server=${historyItem.server}` : ""
              }${historyItem.season ? `&season=${historyItem.season}` : ""}${
                historyItem.episode ? `&episode=${historyItem.episode}` : ""
              }`
            : `/${movie.media_type}/watch?id=${movie.id}`;

          const resumeText = isResumable
            ? movie.media_type === "movie"
              ? "Resume Watching"
              : `Resume S${historyItem.season} E${historyItem.episode}`
            : "Watch Now";

          return (
            <SwiperSlide key={movie.id} className="relative w-full h-full">
              <div className="relative w-full h-full">
                <Image
                  src={`${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}`}
                  alt={movie.title || movie.name || ""}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-r from-background via-background/70 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-center px-6 lg:px-20 max-w-4xl z-10">
                  <div className="mb-6 min-h-[80px] lg:min-h-[120px] flex items-end">
                    {movie.logo_path ? (
                      <div className="relative w-[220px] lg:w-[320px] aspect-3/1">
                        <Image
                          src={`${TMDB_IMAGE_BASE_URL}/original${movie.logo_path}`}
                          alt={movie.title || movie.name || "Movie Logo"}
                          fill
                          sizes="(max-width: 768px) 220px, 320px"
                          className="object-contain object-left drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                        />
                      </div>
                    ) : (
                      <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight leading-[0.95] drop-shadow-lg">
                        {movie.title || movie.name}
                      </h1>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 lg:gap-5 mb-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm lg:text-base font-black text-yellow-400 tracking-tight">
                        {movie.vote_average?.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Calendar className="w-3.5 h-3.5 text-white/40" />
                      <span className="text-xs lg:text-sm font-bold tracking-tight">
                        {new Date(
                          movie.release_date || movie.first_air_date || "",
                        ).getFullYear() || "2024"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {movie.genre_ids?.slice(0, 2).map((id) => {
                        const genreName = TMDB_GENRES[id];
                        if (!genreName) return null;
                        const genreSlug = genreName.toLowerCase().replace(/\s+/g, "-");
                        const pathType = movie.media_type === "movie" ? "movie" : "series";
                        return (
                          <GenreBadge
                            key={id}
                            name={genreName}
                            href={`/${pathType}/${genreSlug}`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <p className="text-white/80 text-xs lg:text-[15px] mb-6 line-clamp-3 max-w-xl font-medium leading-relaxed drop-shadow-md">
                    {movie.overview}
                  </p>

                  <div className="flex items-center gap-3">
                    <Link href={movieWatchUrl} onClick={handleWatchClick}>
                      <Button
                        variant={isResumable ? "premiumBlue" : "premium"}
                        size="xl"
                        className="h-12 text-sm px-6 lg:text-base lg:h-12 lg:px-6"
                      >
                        {isResumable ? (
                          <Play className="w-4 h-4 lg:w-5 lg:h-5 fill-current" />
                        ) : (
                          <FaPlay
                            fill="#000"
                            className="w-4 h-4 lg:w-5 lg:h-5"
                          />
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
                      onClick={() => handleWatchlistToggle(movie)}
                    >
                      {inWatchlist ? (
                        <Bookmark className="w-4 h-4 lg:w-5 lg:h-5 fill-black" />
                      ) : (
                        <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
                      )}
                    </Button>
                    <Link href={detailUrl(movie)}>
                      <Button
                        variant="glass"
                        size="icon-xl"
                        className="size-11 lg:size-12"
                      >
                        <FiAlertCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Pagination Dots */}
      <div className="absolute bottom-24 lg:bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
        {displayMovies.map((_, index) => (
          <div
            key={index}
            onClick={() => swiperInstance?.slideTo(index)}
            className={cn(
              "h-2 rounded-full cursor-pointer transition-all duration-300 relative overflow-hidden",
              activeIndex === index ? "w-8 bg-white/20" : "w-2 bg-white/20",
            )}
          >
            {activeIndex === index && (
              <div
                className="absolute top-0 left-0 h-full bg-white"
                style={{ animation: `progress-timer 8s linear forwards` }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Thumbnails */}
      <div className="absolute bottom-10 right-10 z-50 hidden lg:flex items-center gap-3">
        {displayMovies.map((movie, index) => (
          <TVHeroThumb
            key={movie.id}
            movie={movie}
            index={index}
            isActive={activeIndex === index}
            onSelect={() => swiperInstance?.slideTo(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Herosection;
