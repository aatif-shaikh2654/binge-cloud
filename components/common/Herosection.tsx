"use client";
import { FiAlertCircle } from "react-icons/fi";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import { Plus, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type TMDBMovie } from "@/app/types/tmdb";
import { cn } from "@/lib/utils";
import { TMDB_IMAGE_BASE_URL, TMDB_GENRES } from "@/app/constants/tmdb";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { type Swiper as SwiperClass } from "swiper/types";
import Link from "next/link";
interface HerosectionProps {
  movies: TMDBMovie[];
}

const Herosection: React.FC<HerosectionProps> = ({ movies }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [swiperRef, setSwiperRef] = React.useState<SwiperClass | null>(null);

  if (!movies || movies.length === 0) return null;

  // Filter to only show 6 movies as requested
  const displayMovies = movies.slice(0, 6);

  const watchUrl = (movie: TMDBMovie) => {
    return `/${movie.media_type === "tv" ? "series" : "movies"}/watch/?id=${movie.id}`;
  };

  const detailUrl = (movie: TMDBMovie) => {
    return `/${movie.media_type === "tv" ? "series" : "movies"}/detail/?id=${movie.id}`;
  };

  return (
    <section className="relative w-full h-[85vh] lg:h-screen overflow-hidden group bg-background">
      <Swiper
        onSwiper={setSwiperRef}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        modules={[Autoplay, EffectFade]}
        effect="fade"
        loop={true}
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        navigation={false}
        className="h-full w-full hero-swiper"
      >
        {displayMovies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div className="relative w-full h-full">
              {/* Background Image */}
              <Image
                src={`${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}`}
                alt={movie.title || movie.name || ""}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />

              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

              {/* Content on the left */}
              <div className="absolute inset-0 flex flex-col justify-center px-6 lg:px-24 max-w-4xl z-10">
                {/* Movie Logo or Title Fallback */}
                <div className="mb-6 min-h-[80px] lg:min-h-[120px] flex items-end">
                  {movie.logo_path ? (
                    <div className="relative w-[220px] lg:w-[320px] aspect-[3/1]">
                      <Image
                        src={`${TMDB_IMAGE_BASE_URL}/original${movie.logo_path}`}
                        alt={movie.title || movie.name || "Movie Logo"}
                        fill
                        sizes="(max-width: 768px) 220px, 320px"
                        className="object-contain object-left drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                      />
                    </div>
                  ) : (
                    <h1 className="text-3xl lg:text-5xl font-black text-white uppercase tracking-tight leading-[0.95] drop-shadow-lg">
                      {movie.title || movie.name}
                    </h1>
                  )}
                </div>

                {/* Movie Metadata */}
                <div className="flex flex-wrap items-center gap-3 lg:gap-5 mb-2">
                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm lg:text-base font-black text-yellow-400 tracking-tight">
                      {movie.vote_average?.toFixed(1)}
                    </span>
                    <span className="text-sm font-medium text-white/40">
                      ({((movie.popularity || 0) / 10).toFixed(1)}k)
                    </span>
                  </div>

                  {/* Year */}
                  <div className="flex items-center gap-2 text-white/80">
                    <Calendar className="w-3.5 h-3.5 text-white/40" />
                    <span className="text-xs lg:text-sm font-bold tracking-tight">
                      {new Date(
                        movie.release_date || movie.first_air_date || "",
                      ).getFullYear() || "2024"}
                    </span>
                  </div>

                  {/* Genres */}
                  <div className="flex items-center gap-2">
                    {movie.genre_ids?.slice(0, 2).map((id) => {
                      return (
                        <span
                          key={id}
                          className="px-3 py-1 rounded-full border border-white/20 bg-white/5 text-[9px] lg:text-[10px] font-black text-white/90 tracking-tight"
                        >
                          {TMDB_GENRES[id]}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <p className="text-white/80 text-xs lg:text-[15px] mb-6 line-clamp-3 max-w-xl font-medium leading-relaxed drop-shadow-md">
                  {movie.overview}
                </p>

                {/* Updated Buttons to match reference image */}
                <div className="flex items-center gap-3">
                  {/* Resume Button Group */}
                  <Link href={watchUrl(movie)}>
                    <Button
                      variant="premium"
                      size="xl"
                      className="h-12 text-sm px-6 lg:text-base lg:h-12 lg:px-6"
                    >
                      <FaPlay fill="#000" className="w-4 h-4 lg:w-5 lg:h-5" />{" "}
                      Watch Now
                    </Button>
                  </Link>

                  {/* Watchlist Button */}
                  <Button
                    variant="glass"
                    size="icon-xl"
                    className="size-11 lg:size-12"
                  >
                    <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
                  </Button>

                  {/* Info Button */}
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
        ))}
      </Swiper>

      {/* Pagination Dots - Centered */}
      <div className="absolute bottom-24 lg:bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
        {displayMovies.map((_, index) => (
          <div
            key={index}
            onClick={() => swiperRef?.slideToLoop(index)}
            className={cn(
              "h-2 rounded-full cursor-pointer transition-all duration-300 relative overflow-hidden",
              activeIndex === index ? "w-8 bg-white/20" : "w-2 bg-white/20",
            )}
          >
            {activeIndex === index && (
              <div
                className="absolute top-0 left-0 h-full bg-white"
                style={{
                  animation: `progress-timer 8s linear forwards`,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Thumbnails - Right Aligned (Desktop only) */}
      <div className="absolute bottom-10 right-10 z-50 hidden lg:flex items-center gap-3">
        {displayMovies.map((movie, index) => (
          <div
            key={movie.id}
            onClick={() => swiperRef?.slideToLoop(index)}
            className={cn(
              "relative w-20 aspect-video rounded-md overflow-hidden cursor-pointer transition-all duration-300 border",
              activeIndex === index
                ? "border-white! scale-110 z-10"
                : "border-white/10 opacity-50 hover:opacity-100",
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
        ))}
      </div>
    </section>
  );
};

export default Herosection;
