"use client";

import { AniListMedia, type AniListRelationEdge } from "@/features/anime/types/anilist";
import AnimeCard from "@/features/anime/components/AnimeCard";
import BaseSwiperSlider from "@/shared/components/sliders/BaseSwiperSlider";
import React from "react";
import { SwiperSlide } from "swiper/react";

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
  const animeRelations = relations.filter((r) => r.node.type === "ANIME");
  if (animeRelations.length === 0) return null;

  return (
    <BaseSwiperSlider
      title="Related Anime"
      subtitle="More Like This"
      className="ps-6! lg:ps-24! md:py-6 pb-6"
      headerClassName="pe-8! lg:pe-24!"
      containerClassName="lg:pe-24 pe-6"
    >
      {animeRelations.map(({ relationType, node }) => {
        const relation = RELATION_LABEL[relationType] ?? relationType;

        return (
          <SwiperSlide key={node.id} className="pb-4">
            <AnimeCard anime={node as AniListMedia} badge={relation} />
          </SwiperSlide>
        );
      })}
    </BaseSwiperSlider>
  );
};

export default AnimeRelationsSwiper;
