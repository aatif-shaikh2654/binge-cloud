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

interface AnimeCharactersSliderSwiperProps {
  characters: AniListCharacterEdge[];
}

const ROLE_LABEL: Record<string, string> = {
  MAIN: "Main",
  SUPPORTING: "Supporting",
  BACKGROUND: "Background",
};

const AnimeCharactersSliderSwiper: React.FC<AnimeCharactersSliderSwiperProps> = ({
  characters,
}) => {
  const [prevEl, setPrevEl] = React.useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = React.useState<HTMLButtonElement | null>(null);

  if (!characters || characters.length === 0) return null;

  return (
    <section className="ps-8! lg:ps-24! md:py-6 pb-6 relative z-10 hover:z-50 transition-all duration-300 overflow-hidden md:overflow-visible">
      <div className="flex items-end justify-between mb-8 pe-8! lg:pe-24! border-b border-white/5 pb-4 md:pb-6">
        <div className="space-y-1 md:space-y-2">
          <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-blue-500">
            Voice Cast
          </h3>
          <h2 className="text-2xl md:text-5xl font-black tracking-tighter">Characters</h2>
        </div>
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
          className="!overflow-visible"
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

            return (
              <SwiperSlide key={char.id} className="pb-4">
                <div className="flex flex-col gap-3">
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

                  <div className="px-1 space-y-0.5">
                    <p className="text-xs font-bold text-white line-clamp-1">{charName}</p>
                    {vaName && (
                      <p className="text-[10px] font-medium text-white/40 line-clamp-1">
                        CV: {vaName}
                      </p>
                    )}
                  </div>

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
    </section>
  );
};

export default AnimeCharactersSliderSwiper;
