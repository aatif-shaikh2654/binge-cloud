"use client";

import { AniListMedia, type AniListRelationEdge } from "@/app/types/anilist";
import AnimeCard from "@/components/common/AnimeCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

interface AnimeRelationsSwiperProps {
  relations: AniListRelationEdge[];
}

const RELATION_LABEL: Record<string, string> = {
  SEQUEL: "Sequel",
  PREQUEL: "Prequel",
  ALTERNATIVE: "Alternative",
  SIDE_STORY: "Side Story",
  SUMMARY: "Summary",
  SOURCE: "Source",
  SPIN_OFF: "Spin-Off",
  ADAPTATION: "Adaptation",
  CHARACTER: "Character",
  OTHER: "Other",
};

const AnimeRelationsSwiper: React.FC<AnimeRelationsSwiperProps> = ({
  relations,
}) => {
  const [prevEl, setPrevEl] = React.useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = React.useState<HTMLButtonElement | null>(null);

  const animeRelations = relations.filter((r) => r.node.type === "ANIME");
  if (animeRelations.length === 0) return null;

  return (
    <section className="ps-6! lg:ps-24! md:py-6 pb-6 relative z-10 hover:z-50 transition-all duration-300 overflow-hidden">
      <div className="flex items-end justify-between mb-8 pe-8! lg:pe-24! border-b border-white/5 pb-4 md:pb-6">
        <div className="space-y-1 md:space-y-2">
          <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-blue-500">
            More Like This
          </h3>
          <h2 className="text-2xl md:text-5xl font-black tracking-tighter">
            Related Anime
          </h2>
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

      <div className="movie-slider-container lg:pe-24 pe-6">
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
            1536: { slidesPerView: 7.2, spaceBetween: 16 },
            1920: { slidesPerView: 8.2, spaceBetween: 16 },
          }}
          className="!overflow-visible"
        >
          {animeRelations.map(({ relationType, node }) => {
            const relation = RELATION_LABEL[relationType] ?? relationType;

            return (
              <SwiperSlide key={node.id} className="pb-4">
                <AnimeCard anime={node as AniListMedia} badge={relation} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default AnimeRelationsSwiper;
