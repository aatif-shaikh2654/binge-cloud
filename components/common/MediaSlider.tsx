"use client";

import { type TMDBMovie } from "@/app/types/tmdb";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoveRight } from "lucide-react";
import React, { useRef } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import MovieCard from "./MovieCard";

// Import Swiper styles
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";

interface MediaSliderProps {
  movies: TMDBMovie[];
  title: string;
  className?: string;
  media_type?: string;
}

const MediaSlider: React.FC<MediaSliderProps> = ({
  movies,
  title,
  className,
  media_type,
}) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  if (!movies || movies.length === 0) return null;

  return (
    <section className={cn("px-8 lg:px-24 md:py-12 pb-12", className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-8 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
          <h2 className="text-2xl font-black tracking-tight text-white">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-6">
          {media_type && (
            <Link
              href={`/${media_type}`}
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
            >
              <span className="text-xs font-black uppercase tracking-widest">
                See All
              </span>
              <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}

          {/* Custom Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <button
              ref={prevRef}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all active:scale-90 disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              ref={nextRef}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all active:scale-90 disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Swiper Slider */}
      <div className="overflow-hidden md:overflow-visible">
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: null,
            nextEl: null,
          }}
          onBeforeInit={(swiper) => {
            // @ts-expect-error - Swiper types sometimes conflict with custom navigation elements
            swiper.params.navigation.prevEl = prevRef.current;
            // @ts-expect-error - Swiper types sometimes conflict with custom navigation elements
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          spaceBetween={24}
          slidesPerView={2.2}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            768: { slidesPerView: 4.2 },
            1024: { slidesPerView: 5.2 },
            1280: { slidesPerView: 6.2 },
            1536: { slidesPerView: 7.2 },
            1920: { slidesPerView: 8.2 },
          }}
          className="movie-swiper !overflow-visible"
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.id} className="pb-4">
              <MovieCard movie={movie} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default MediaSlider;
