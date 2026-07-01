"use client";

import { type TMDBCast } from "@/app/types/tmdb";
import CastCard from "@/components/common/CastCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

interface CastSliderProps {
  cast: TMDBCast[];
}

const CastSlider: React.FC<CastSliderProps> = ({ cast }) => {
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

  if (!cast || cast.length === 0) return null;

  return (
    <section className="space-y-8 md:space-y-12 ps-8! lg:ps-24! overflow-hidden">
      <div className="flex items-end justify-between border-b border-white/5 pb-4 md:pb-6 pe-8! lg:pe-24!">
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
            ref={setPrevEl}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            ref={setNextEl}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      <div className="movie-slider-container">
        <Swiper
          modules={[Navigation, FreeMode]}
          navigation={{
            prevEl,
            nextEl,
          }}
          onBeforeInit={(swiper) => {
            // @ts-expect-error - swiper navigation params
            swiper.params.navigation.prevEl = prevEl;
            // @ts-expect-error - swiper navigation params
            swiper.params.navigation.nextEl = nextEl;
          }}
          spaceBetween={16}
          slidesPerView={2.2}
          freeMode={true}
          breakpoints={{
            480: {
              slidesPerView: 2.2,
              spaceBetween: 16,
            },
            640: {
              slidesPerView: 3.2,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 4.2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 5.2,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 6.2,
              spaceBetween: 24,
            },
          }}
          className="overflow-visible!"
        >
          {cast.map((person, index) => (
            <SwiperSlide key={person.id} className="pb-10">
              <CastCard person={person} index={index} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default CastSlider;
