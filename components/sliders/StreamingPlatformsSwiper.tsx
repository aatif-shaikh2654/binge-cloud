"use client";

import { PLATFORMS } from "@/app/constants/platforms";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

export default function StreamingPlatformsSwiper() {
  const [prevEl, setPrevEl] = React.useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = React.useState<HTMLButtonElement | null>(null);

  return (
    <section className="ps-6! lg:ps-20! md:py-6 pb-6 relative z-10 hover:z-50 transition-all duration-300 overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 pe-8! lg:pe-20!">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-8 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
          <h2 className="text-2xl font-black tracking-tight text-white">
            Streaming Platforms
          </h2>
        </div>

        {/* Custom Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <button
            ref={setPrevEl}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            ref={setNextEl}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Slider Container */}
      <div className="movie-slider-container lg:pe-20 pe-6">
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
            640: { slidesPerView: 2.2, spaceBetween: 16 },
            768: { slidesPerView: 3.2, spaceBetween: 16 },
            1024: { slidesPerView: 4.2, spaceBetween: 20 },
            1280: { slidesPerView: 5.2, spaceBetween: 20 },
          }}
          className="overflow-visible!"
        >
          {PLATFORMS.map((platform) => (
            <SwiperSlide key={platform.id} className="pb-4 overflow-visible!">
              <Link
                href={`/platforms/${platform.slug}`}
                className={cn(
                  "group relative flex items-center justify-center aspect-video md:rounded-2xl rounded-lg border transition-all duration-300 ease-out cursor-pointer p-4 md:p-6 shadow-xl",
                  platform.bgClass,
                )}
              >
                {/* Animated Glow effect */}
                <div className="absolute inset-0 bg-white/1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Logo Image Only (No text or description, centered and scaled beautifully) */}
                <div className="relative w-full h-full max-w-[65%] max-h-[65%] flex items-center justify-center">
                  <Image
                    src={platform.logoPath}
                    alt={platform.name}
                    fill
                    sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 250px"
                    className="object-contain filter group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
