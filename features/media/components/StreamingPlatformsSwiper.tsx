"use client";

import { PLATFORMS } from "@/features/media/constants/platforms";
import { cn } from "@/shared/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { SwiperSlide } from "swiper/react";
import BaseSwiperSlider from "@/shared/components/sliders/BaseSwiperSlider";

export default function StreamingPlatformsSwiper() {
  const PLATFORMS_BREAKPOINTS = {
    640: { slidesPerView: 2.2, spaceBetween: 16 },
    768: { slidesPerView: 3.2, spaceBetween: 16 },
    1024: { slidesPerView: 4.2, spaceBetween: 20 },
    1280: { slidesPerView: 5.2, spaceBetween: 20 },
  };

  return (
    <BaseSwiperSlider
      title="Streaming Platforms"
      breakpoints={PLATFORMS_BREAKPOINTS}
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
    </BaseSwiperSlider>
  );
}
