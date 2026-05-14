"use client";

import { useWatchNavigation } from "@/app/hooks/useWatchNavigation";
import { useHistoryStore } from "@/app/store/useHistoryStore";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

const WatchHistorySwiper = () => {
  const { history, removeFromHistory } = useHistoryStore();
  const { handleWatchClick } = useWatchNavigation();
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
          {history.map((item) => {
            return (
              <SwiperSlide key={item.id} className="pb-4">
                <div className="group relative w-full aspect-video rounded-2xl overflow-hidden border border-white/5 bg-white/5 hover:border-blue-500/30 transition-all duration-500">
                  <Link
                    href={
                      item.media_type === "anime"
                        ? `/anime/watch?id=${item.id}${item.episode ? `&ep=${item.episode}` : ""}`
                        : `/${item.media_type}/watch?id=${item.id}&server=${item.server}${item.season ? `&season=${item.season}&episode=${item.episode}` : ""}`
                    }
                    onClick={handleWatchClick}
                    className="block w-full h-full"
                  >
                    <Image
                      src={
                        item.backdrop_path?.startsWith("http") ||
                        item.poster_path?.startsWith("http")
                          ? item.backdrop_path || item.poster_path
                          : `https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`
                      }
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] transform scale-75 group-hover:scale-100 transition-transform duration-500">
                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-[15px] font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1.5 flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                          {item.media_type === "tv"
                            ? "TV"
                            : item.media_type === "anime"
                              ? "Anime"
                              : "Movie"}
                        </span>
                        {item.media_type === "tv" && (
                          <span>
                            S{item.season} • E{item.episode}
                          </span>
                        )}
                        {item.media_type === "anime" && item.episode && (
                          <span>EP {item.episode}</span>
                        )}
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromHistory(item.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-full text-white/40 hover:text-white hover:bg-red-500/80 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10 border border-white/10 shadow-lg"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default WatchHistorySwiper;
