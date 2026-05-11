"use client";

import { type TMDBCast } from "@/app/types/tmdb";
import CastCard from "@/components/common/CastCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef } from "react";
import Slider from "react-slick";

// Import Slick styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface CastSliderProps {
  cast: TMDBCast[];
}

const CastSlider: React.FC<CastSliderProps> = ({ cast }) => {
  const sliderRef = useRef<Slider>(null);

  if (!cast || cast.length === 0) return null;

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6.2,
    slidesToScroll: 2,
    arrows: false,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 6.2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5.2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4.2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 3.2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2.2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="space-y-8 md:space-y-12">
      <div className="flex items-end justify-between border-b border-white/5 pb-4 md:pb-6">
        <div className="space-y-1 md:space-y-2 w-full md:w-auto">
          <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-blue-500">
            The Ensemble
          </h3>
          <h2 className="text-2xl md:text-5xl font-black tracking-tighter">
            Main Casting
          </h2>
        </div>

        {/* Custom Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => sliderRef.current?.slickPrev()}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all active:scale-90"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => sliderRef.current?.slickNext()}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all active:scale-90"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      <div className="movie-slider-container">
        <Slider ref={sliderRef} {...settings}>
          {cast.map((person, index) => (
            <div key={person.id} className="px-4 pb-10">
              <CastCard person={person} index={index} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default CastSlider;
