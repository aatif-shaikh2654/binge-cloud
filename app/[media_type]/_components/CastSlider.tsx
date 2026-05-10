"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type TMDBCast } from "@/app/types/tmdb";
import CastCard from "@/components/common/CastCard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

interface CastSliderProps {
  cast: TMDBCast[];
}

const CastSlider: React.FC<CastSliderProps> = ({ cast }) => {
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

  if (!cast || cast.length === 0) return null;

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between border-b border-white/5 pb-6">
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-blue-500">
            The Ensemble
          </h3>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">
            Main Casting
          </h2>
        </div>

        {/* Custom Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <button
            ref={setPrevEl}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all active:scale-90 disabled:opacity-30"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            ref={setNextEl}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all active:scale-90 disabled:opacity-30"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      <div className="relative">
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl,
            nextEl,
          }}
          onBeforeInit={(swiper) => {
            // @ts-expect-error - swiper navigation params are not fully typed
            swiper.params.navigation.prevEl = prevEl;
            // @ts-expect-error - swiper navigation params are not fully typed
            swiper.params.navigation.nextEl = nextEl;
          }}
          spaceBetween={32}
          slidesPerView={2.2}
          breakpoints={{
            640: { slidesPerView: 3.2 },
            768: { slidesPerView: 4.2 },
            1024: { slidesPerView: 5.2 },
            1280: { slidesPerView: 6.2 },
          }}
          className="cast-swiper !overflow-visible"
        >
          {cast.map((person, index) => (
            <SwiperSlide key={person.id} className="pb-10">
              <CastCard person={person} index={index} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CastSlider;
