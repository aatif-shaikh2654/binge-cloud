"use client";

import React, { useState } from "react";
import { Swiper } from "swiper/react";
import { FreeMode, Navigation, Mousewheel } from "swiper/modules";
import { ChevronLeft, ChevronRight, MoveRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

export interface BaseSwiperSliderProps {
  title: string;
  subtitle?: string;
  titlePulse?: boolean;
  seeAllHref?: string;
  seeAllText?: string;
  className?: string;
  containerClassName?: string;
  headerClassName?: string;
  navigationSize?: "sm" | "lg";
  spaceBetween?: number;
  slidesPerView?: number;
  breakpoints?: React.ComponentProps<typeof Swiper>["breakpoints"];
  children: React.ReactNode;
}

const DEFAULT_BREAKPOINTS = {
  480: { slidesPerView: 2.6, spaceBetween: 16 },
  640: { slidesPerView: 3.2, spaceBetween: 16 },
  768: { slidesPerView: 4.2, spaceBetween: 16 },
  1024: { slidesPerView: 5.2, spaceBetween: 20 },
  1280: { slidesPerView: 6.2, spaceBetween: 20 },
  1536: { slidesPerView: 7.2, spaceBetween: 20 },
  1920: { slidesPerView: 8.2, spaceBetween: 20 },
};

const BaseSwiperSlider: React.FC<BaseSwiperSliderProps> = ({
  title,
  subtitle,
  titlePulse = false,
  seeAllHref,
  seeAllText = "See All",
  className,
  containerClassName,
  headerClassName,
  navigationSize = "sm",
  spaceBetween = 16,
  slidesPerView = 2.2,
  breakpoints = DEFAULT_BREAKPOINTS,
  children,
}) => {
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

  const isDetailStyle = !!subtitle;

  return (
    <section
      className={cn(
        "ps-6! lg:ps-20! md:py-6 pb-6 relative z-10 hover:z-50 transition-all duration-300 overflow-hidden",
        className
      )}
    >
      {/* Section Header */}
      <div
        className={cn(
          "flex justify-between pe-8! lg:pe-20!",
          isDetailStyle ? "items-end mb-8 border-b border-white/5 pb-4 md:pb-6" : "items-center mb-8",
          headerClassName
        )}
      >
        {isDetailStyle ? (
          <div className="space-y-1 md:space-y-2">
            <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-blue-500">
              {subtitle}
            </h3>
            <h2 className="text-2xl md:text-5xl font-black tracking-tighter text-white">
              {title}
            </h2>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-8 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
              {title}
              {titlePulse && (
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              )}
            </h2>
          </div>
        )}

        <div className="flex items-center gap-6">
          {seeAllHref && (
            <Link
              href={seeAllHref}
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
            >
              <span className="text-xs font-black uppercase tracking-widest">
                {seeAllText}
              </span>
              <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}

          {/* Navigation Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              ref={setPrevEl}
              className={cn(
                "rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer",
                navigationSize === "lg" ? "w-12 h-12" : "w-10 h-10"
              )}
            >
              <ChevronLeft className={cn("text-white", navigationSize === "lg" ? "w-6 h-6" : "w-5 h-5")} />
            </button>
            <button
              ref={setNextEl}
              className={cn(
                "rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer",
                navigationSize === "lg" ? "w-12 h-12" : "w-10 h-10"
              )}
            >
              <ChevronRight className={cn("text-white", navigationSize === "lg" ? "w-6 h-6" : "w-5 h-5")} />
            </button>
          </div>
        </div>
      </div>

      {/* Slider Container */}
      <div className={cn("movie-slider-container lg:pe-20 pe-6", containerClassName)}>
        <Swiper
          modules={[Navigation, FreeMode, Mousewheel]}
          navigation={{ prevEl, nextEl }}
          mousewheel={{ forceToAxis: true }}
          onBeforeInit={(swiper) => {
            // @ts-expect-error swiper navigation params
            swiper.params.navigation.prevEl = prevEl;
            // @ts-expect-error swiper navigation params
            swiper.params.navigation.nextEl = nextEl;
          }}
          spaceBetween={spaceBetween}
          slidesPerView={slidesPerView}
          freeMode={true}
          breakpoints={breakpoints}
          className="overflow-visible!"
        >
          {children}
        </Swiper>
      </div>
    </section>
  );
};

export default BaseSwiperSlider;
