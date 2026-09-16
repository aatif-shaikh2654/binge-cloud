"use client";

import { MediaType } from "@/shared/types/common";
import { type TMDBMovie } from "@/features/media/types/tmdb";
import React from "react";
import { SwiperSlide } from "swiper/react";
import MovieCard from "./MovieCard";
import BaseSwiperSlider from "@/shared/components/sliders/BaseSwiperSlider";

interface MediaSliderProps {
  movies: TMDBMovie[];
  title: string;
  className?: string;
  media_type?: string;
  seeAllHref?: string;
  showRank?: boolean;
}

const MediaSliderSwiper: React.FC<MediaSliderProps> = ({
  movies,
  title,
  className,
  media_type,
  seeAllHref,
  showRank,
}) => {
  if (!movies || movies.length === 0) return null;

  return (
    <BaseSwiperSlider
      title={title}
      seeAllHref={seeAllHref || (media_type ? `/${media_type}` : undefined)}
      className={className}
    >
      {movies.map((movie, index) => (
        <SwiperSlide key={movie.id} className="pb-4 overflow-visible!">
          <MovieCard
            movie={movie}
            mediaType={media_type as MediaType}
            rank={showRank ? index + 1 : undefined}
          />
        </SwiperSlide>
      ))}
    </BaseSwiperSlider>
  );
};

export default MediaSliderSwiper;
