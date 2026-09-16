"use client";

import { type AniListMedia } from "@/features/anime/types/anilist";
import dynamic from "next/dynamic";
import SliderSkeleton from "@/shared/components/sliders/SliderSkeleton";

interface AnimeSliderProps {
  anime: AniListMedia[];
  title: string;
  className?: string;
  seeAllHref?: string;
}

const AnimeSliderSwiper = dynamic(() => import("./AnimeSliderSwiper"), {
  ssr: false,
  loading: (props) => <SliderSkeleton title="" {...props} />,
});

const AnimeSlider = (props: AnimeSliderProps) => {
  return <AnimeSliderSwiper {...props} />;
};

export default AnimeSlider;
