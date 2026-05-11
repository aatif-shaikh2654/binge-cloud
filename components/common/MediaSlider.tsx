"use client";

import { type TMDBMovie } from "@/app/types/tmdb";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoveRight } from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";
import Slider from "react-slick";
import MovieCard from "./MovieCard";

// Import slick-carousel styles
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

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
  const sliderRef = useRef<Slider>(null);

  if (!movies || movies.length === 0) return null;

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 8.2,
    slidesToScroll: 2,
    arrows: false,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1920,
        settings: {
          slidesToShow: 7.2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 6.2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5.2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4.2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3.2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2.2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className={cn("ps-8! lg:ps-24! md:py-6 pb-6", className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 pe-8! lg:pe-24!">
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
              onClick={() => sliderRef.current?.slickPrev()}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all active:scale-90"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all active:scale-90"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Slider Container */}
      <div className="movie-slider-container">
        <Slider ref={sliderRef} {...settings}>
          {movies.map((movie) => (
            <div key={movie.id} className="px-3 pb-4">
              <MovieCard movie={movie} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default MediaSlider;
