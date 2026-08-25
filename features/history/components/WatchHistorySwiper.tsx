"use client";

import { useHistoryStore } from "@/app/store/useHistoryStore";
import { SwiperSlide } from "swiper/react";
import HistoryCard from "../common/HistoryCard";
import BaseSwiperSlider from "./BaseSwiperSlider";

interface WatchHistorySwiperProps {
  filterType?: "anime" | "movie" | "tv";
}

const WatchHistorySwiper = ({ filterType }: WatchHistorySwiperProps) => {
  const { history } = useHistoryStore();

  const filteredHistory = filterType
    ? history.filter((item) => item.media_type === filterType)
    : history;

  if (filteredHistory.length === 0) return null;

  const HISTORY_BREAKPOINTS = {
    480: { slidesPerView: 1.5, spaceBetween: 16 },
    640: { slidesPerView: 1.8, spaceBetween: 16 },
    768: { slidesPerView: 2.8, spaceBetween: 24 },
    1024: { slidesPerView: 3.8, spaceBetween: 24 },
    1280: { slidesPerView: 3.8, spaceBetween: 24 },
    1536: { slidesPerView: 3.8, spaceBetween: 24 },
    1920: { slidesPerView: 4.8, spaceBetween: 24 },
  };

  return (
    <BaseSwiperSlider
      title="Continue Watching"
      titlePulse
      className="md:pt-8 md:pb-4 pb-4"
      slidesPerView={1.2}
      breakpoints={HISTORY_BREAKPOINTS}
    >
      {filteredHistory.map((item) => (
        <SwiperSlide key={item.id} className="pb-4">
          <HistoryCard item={item} />
        </SwiperSlide>
      ))}
    </BaseSwiperSlider>
  );
};

export default WatchHistorySwiper;
