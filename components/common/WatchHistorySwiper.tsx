"use client";

import { useHistoryStore } from "@/app/store/useHistoryStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import HistoryCard from "./HistoryCard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

const WatchHistorySwiper = () => {
  const { history } = useHistoryStore();
  const [prevEl, setPrevEl] = React.useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = React.useState<HTMLButtonElement | null>(null);

  if (history.length === 0) return null;

  return (
    <section className="ps-8! lg:ps-24! md:py-8 pb-12 overflow-hidden md:overflow-visible">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 pe-8! lg:pe-24!">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-8 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
            Continue Watching
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          </h2>
        </div>

        {/* Custom Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <button
            ref={setPrevEl}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            ref={setNextEl}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Slider Container */}
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
          slidesPerView={1.2}
          freeMode={true}
          breakpoints={{
            480: { slidesPerView: 1.2, spaceBetween: 16 },
            640: { slidesPerView: 1.5, spaceBetween: 16 },
            768: { slidesPerView: 2.5, spaceBetween: 24 },
            1024: { slidesPerView: 3.5, spaceBetween: 24 },
            1280: { slidesPerView: 4.5, spaceBetween: 24 },
          }}
          className="!overflow-visible"
        >
          {history.map((item) => (
            <SwiperSlide key={item.id} className="pb-4">
              <HistoryCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default WatchHistorySwiper;
