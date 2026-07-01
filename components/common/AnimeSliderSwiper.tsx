"use client";

import { type AniListMedia } from "@/app/types/anilist";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoveRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import AnimeCard from "./AnimeCard";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

interface AnimeSliderSwiperProps {
  anime: AniListMedia[];
  title: string;
  className?: string;
  seeAllHref?: string;
}

const AnimeSliderSwiper: React.FC<AnimeSliderSwiperProps> = ({
  anime,
  title,
  className,
  seeAllHref,
}) => {
  const [prevEl, setPrevEl] = React.useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = React.useState<HTMLButtonElement | null>(null);

  if (!anime || anime.length === 0) return null;

  return (
    <section
      className={cn(
        "ps-6! lg:ps-20! md:py-6 pb-6 relative z-10 hover:z-50 transition-all duration-300 overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-8 pe-8! lg:pe-20!">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-8 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
          <h2 className="text-2xl font-black tracking-tight text-white">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-6">
          {seeAllHref && (
            <Link
              href={seeAllHref}
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
            >
              <span className="text-xs font-black uppercase tracking-widest">
                See All
              </span>
              <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}

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
      </div>

      <div className="movie-slider-container lg:pe-20 pe-6">
        <Swiper
          modules={[Navigation, FreeMode]}
          navigation={{ prevEl, nextEl }}
          onBeforeInit={(swiper) => {
            // @ts-expect-error swiper navigation params
            swiper.params.navigation.prevEl = prevEl;
            // @ts-expect-error swiper navigation params
            swiper.params.navigation.nextEl = nextEl;
          }}
          spaceBetween={16}
          slidesPerView={2.2}
          freeMode={true}
          breakpoints={{
            480: { slidesPerView: 2.6, spaceBetween: 16 },
            640: { slidesPerView: 3.2, spaceBetween: 16 },
            768: { slidesPerView: 4.2, spaceBetween: 16 },
            1024: { slidesPerView: 5.2, spaceBetween: 20 },
            1280: { slidesPerView: 6.2, spaceBetween: 20 },
            1536: { slidesPerView: 7.2, spaceBetween: 20 },
            1920: { slidesPerView: 8.2, spaceBetween: 20 },
          }}
          className="overflow-visible!"
        >
          {anime.map((item) => (
            <SwiperSlide key={item.id} className="pb-4">
              <AnimeCard anime={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default AnimeSliderSwiper;
