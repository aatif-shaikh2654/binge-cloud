"use client";

import { type TMDBCast } from "@/features/media/types/tmdb";
import CastCard from "@/features/media/components/CastCard";
import BaseSwiperSlider from "@/shared/components/sliders/BaseSwiperSlider";
import React from "react";
import { SwiperSlide } from "swiper/react";

interface CastSliderProps {
  cast: TMDBCast[];
}

const CastSlider: React.FC<CastSliderProps> = ({ cast }) => {
  if (!cast || cast.length === 0) return null;

  const CAST_BREAKPOINTS = {
    480: {
      slidesPerView: 2.2,
      spaceBetween: 16,
    },
    640: {
      slidesPerView: 3.2,
      spaceBetween: 16,
    },
    768: {
      slidesPerView: 4.2,
      spaceBetween: 24,
    },
    1024: {
      slidesPerView: 5.2,
      spaceBetween: 24,
    },
    1280: {
      slidesPerView: 6.2,
      spaceBetween: 24,
    },
  };

  return (
    <BaseSwiperSlider
      title="Main Casting"
      subtitle="The Ensemble"
      className="space-y-8 md:space-y-12 ps-8! lg:ps-24!"
      headerClassName="pe-8! lg:pe-24!"
      containerClassName="lg:pe-0 pe-0"
      navigationSize="lg"
      breakpoints={CAST_BREAKPOINTS}
    >
      {cast.map((person, index) => (
        <SwiperSlide key={person.id} className="pb-10">
          <CastCard person={person} index={index} />
        </SwiperSlide>
      ))}
    </BaseSwiperSlider>
  );
};

export default CastSlider;
