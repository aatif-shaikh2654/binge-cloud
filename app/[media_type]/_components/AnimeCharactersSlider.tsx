"use client";

import { type AniListCharacterEdge } from "@/app/types/anilist";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React from "react";
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

interface AnimeCharactersSliderProps {
  characters: AniListCharacterEdge[];
}

const ROLE_LABEL: Record<string, string> = {
  MAIN: "Main",
  SUPPORTING: "Supporting",
  BACKGROUND: "Background",
};

const AnimeCharactersSlider: React.FC<AnimeCharactersSliderProps> = ({
  characters,
}) => {
  const [prevEl, setPrevEl] = React.useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = React.useState<HTMLButtonElement | null>(null);

  if (!characters || characters.length === 0) return null;

  return (
    <div className="space-y-8 md:space-y-12">
      <div className="flex items-end justify-between border-b border-white/5 pb-4 md:pb-6">
        <div className="space-y-1 md:space-y-2 w-full md:w-auto">
          <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-blue-500">
            Voice Cast
          </h3>
          <h2 className="text-2xl md:text-5xl font-black tracking-tighter">Characters</h2>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <button
            ref={setPrevEl}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all active:scale-90"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            ref={setNextEl}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all active:scale-90"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      <div className="movie-slider-container">
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
          freeMode
          breakpoints={{
            480: { slidesPerView: 2.2, spaceBetween: 16 },
            640: { slidesPerView: 3.2, spaceBetween: 16 },
            768: { slidesPerView: 4.2, spaceBetween: 16 },
            1024: { slidesPerView: 5.2, spaceBetween: 16 },
            1280: { slidesPerView: 6.2, spaceBetween: 16 },
          }}
        >
          {characters.map(({ role, node: char, voiceActors }) => {
            const charName = char.name.full || `${char.name.first ?? ""} ${char.name.last ?? ""}`.trim();
            const va = voiceActors[0] ?? null;
            const vaName = va
              ? va.name.full || `${va.name.first ?? ""} ${va.name.last ?? ""}`.trim()
              : null;

            return (
              <SwiperSlide key={char.id} className="pb-4">
                <div className="flex flex-col gap-3">
                  {/* Character card */}
                  <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-white/5 bg-white/5 group">
                    {char.image.large ? (
                      <Image
                        src={char.image.large}
                        alt={charName}
                        fill
                        sizes="(max-width: 768px) 100vw, 200px"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs">
                        No Image
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <span
                        className={cn(
                          "text-[9px] font-black uppercase tracking-wider",
                          role === "MAIN" ? "text-blue-400" : "text-white/50",
                        )}
                      >
                        {ROLE_LABEL[role] ?? role}
                      </span>
                    </div>
                  </div>

                  {/* Character name */}
                  <div className="px-1 space-y-0.5">
                    <p className="text-xs font-bold text-white line-clamp-1">{charName}</p>
                    {vaName && (
                      <p className="text-[10px] font-medium text-white/40 line-clamp-1">
                        CV: {vaName}
                      </p>
                    )}
                  </div>

                  {/* VA avatar */}
                  {va?.image.large && (
                    <div className="flex items-center gap-2 px-1">
                      <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/10 shrink-0">
                        <Image
                          src={va.image.large}
                          alt={vaName ?? ""}
                          fill
                          sizes="28px"
                          className="object-cover"
                        />
                      </div>
                      <p className="text-[10px] font-medium text-white/50 line-clamp-1">{vaName}</p>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default AnimeCharactersSlider;
