"use client";

import { type TMDBMovie } from "@/app/types/tmdb";
import dynamic from "next/dynamic";
import SliderSkeleton from "./SliderSkeleton";

interface MediaSliderProps {
  movies: TMDBMovie[];
  title: string;
  className?: string;
  media_type?: string;
  seeAllHref?: string;
  showRank?: boolean;
}

const MediaSliderSwiper = dynamic(() => import("./MediaSliderSwiper"), {
  ssr: false,
  loading: (props) => <SliderSkeleton title="" {...props} />,
});

const MediaSlider = (props: MediaSliderProps) => {
  return <MediaSliderSwiper {...props} />;
};

export default MediaSlider;
