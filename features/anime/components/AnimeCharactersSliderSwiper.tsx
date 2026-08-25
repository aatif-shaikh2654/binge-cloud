"use client";

import { type AniListCharacterEdge } from "@/features/anime/types/anilist";
import BaseSwiperSlider from "@/shared/components/sliders/BaseSwiperSlider";
import { cn } from "@/shared/lib/utils";
import Image from "next/image";
import React from "react";
import { SwiperSlide } from "swiper/react";

interface AnimeCharactersSliderSwiperProps {
  characters: AniListCharacterEdge[];
}

const ROLE_LABEL: Record<string, string> = {
  MAIN: "Main",
  SUPPORTING: "Supporting",
  BACKGROUND: "Background",
};

const AnimeCharactersSliderSwiper: React.FC<
  AnimeCharactersSliderSwiperProps
> = ({ characters }) => {
  if (!characters || characters.length === 0) return null;

  const CHAR_BREAKPOINTS = {
    480: { slidesPerView: 2.2, spaceBetween: 16 },
    640: { slidesPerView: 3.2, spaceBetween: 16 },
    768: { slidesPerView: 4.2, spaceBetween: 16 },
    1024: { slidesPerView: 5.2, spaceBetween: 16 },
    1280: { slidesPerView: 6.2, spaceBetween: 16 },
    1536: { slidesPerView: 7.2, spaceBetween: 16 },
    1920: { slidesPerView: 8.2, spaceBetween: 16 },
  };

  return (
    <BaseSwiperSlider
      title="Characters"
      subtitle="Voice Cast"
      className="ps-6! lg:ps-24! md:py-6 pb-6"
      headerClassName="pe-8! lg:pe-24!"
      containerClassName="lg:pe-24 pe-6"
      breakpoints={CHAR_BREAKPOINTS}
    >
      {characters.map(({ role, node: char, voiceActors }) => {
        const charName =
          char.name.full ||
          `${char.name.first ?? ""} ${char.name.last ?? ""}`.trim();
        const va = voiceActors[0] ?? null;
        const vaName = va
          ? va.name.full ||
            `${va.name.first ?? ""} ${va.name.last ?? ""}`.trim()
          : null;

        const mainImage = va?.image.large || char.image.large;
        const insetImage = va?.image.large ? char.image.large : null;

        return (
          <SwiperSlide key={char.id} className="pb-4">
            <div className="flex flex-col gap-3 group">
              <div className="relative aspect-2/3 w-full overflow-hidden rounded-xl border border-white/5 bg-white/5 transition-all duration-300 group-hover:border-white/20">
                {mainImage ? (
                  <Image
                    src={mainImage}
                    alt={vaName || charName}
                    fill
                    sizes="(max-width: 768px) 100vw, 200px"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs">
                    No Image
                  </div>
                )}

                {/* Inset Character Image */}
                {insetImage && (
                  <div className="absolute top-2 right-2 w-12 h-12 rounded-lg overflow-hidden border border-white/20 shadow-xl z-10 transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src={insetImage}
                      alt={charName}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
                  <span
                    className={cn(
                      "text-[9px] font-black uppercase tracking-widest",
                      role === "MAIN" ? "text-blue-400" : "text-white/50",
                    )}
                  >
                    {ROLE_LABEL[role] ?? role}
                  </span>
                </div>
              </div>

              <div className="px-1 space-y-0.5">
                <p className="text-xs font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
                  {charName}
                </p>
                {vaName && (
                  <p className="text-[10px] font-medium text-white/40 line-clamp-1">
                    CV: {vaName}
                  </p>
                )}
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </BaseSwiperSlider>
  );
};

export default AnimeCharactersSliderSwiper;
