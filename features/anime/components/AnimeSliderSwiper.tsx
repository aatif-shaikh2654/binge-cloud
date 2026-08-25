"use client";

import { type AniListMedia } from "@/features/anime/types/anilist";
import React from "react";
import { SwiperSlide } from "swiper/react";
import AnimeCard from "./AnimeCard";
import BaseSwiperSlider from "@/shared/components/sliders/BaseSwiperSlider";

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
  if (!anime || anime.length === 0) return null;

  return (
    <BaseSwiperSlider
      title={title}
      seeAllHref={seeAllHref}
      className={className}
    >
      {anime.map((item) => (
        <SwiperSlide key={item.id} className="pb-4">
          <AnimeCard anime={item} />
        </SwiperSlide>
      ))}
    </BaseSwiperSlider>
  );
};

export default AnimeSliderSwiper;
