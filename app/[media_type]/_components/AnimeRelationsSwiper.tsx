"use client";

import { FORMAT_LABEL, STATUS_LABEL } from "@/app/constants/anilist";
import { type AniListRelationEdge } from "@/app/types/anilist";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
    <section className="ps-8! lg:ps-24! md:py-6 pb-6 relative z-10 hover:z-50 transition-all duration-300 overflow-hidden md:overflow-visible">
      <div className="flex items-end justify-between mb-8 pe-8! lg:pe-24! border-b border-white/5 pb-4 md:pb-6">
        <div className="space-y-1 md:space-y-2">
          <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-blue-500">
            More Like This
          </h3>
          <h2 className="text-2xl md:text-5xl font-black tracking-tighter">Related Anime</h2>
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
          {animeRelations.map(({ relationType, node }) => {
            const title = node.title.english || node.title.romaji || "Unknown";
            const cover = node.coverImage.extraLarge || node.coverImage.large;
            const format = node.format ? (FORMAT_LABEL[node.format] ?? node.format) : null;
            const status = node.status ? (STATUS_LABEL[node.status] ?? node.status) : null;
            const relation = RELATION_LABEL[relationType] ?? relationType;

            return (
              <SwiperSlide key={node.id} className="pb-4">
                <Link
                  href={`/anime/detail?id=${node.id}`}
                  className="group flex flex-col gap-2"
                >
                  <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-white/5 bg-white/5 transition-all duration-300 group-hover:border-white/20">
                    {cover && (
                      <Image
                        src={cover}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 50vw, 200px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute top-2 left-2">
                      <span className="bg-blue-600/80 backdrop-blur-sm text-white text-[9px] font-black px-2 py-0.5 rounded tracking-wider uppercase">
                        {relation}
                      </span>
                    </div>
                  </div>
                  <div className="px-1 space-y-0.5">
                    <p className="text-xs font-bold text-white line-clamp-2 leading-tight">{title}</p>
                    <p className="text-[10px] font-medium text-white/40">
                      {[format, status].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default AnimeRelationsSwiper;
