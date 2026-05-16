"use client";

import { type TMDBMovie } from "@/app/types/tmdb";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

interface MediaSliderProps {
  movies: TMDBMovie[];
  title: string;
  className?: string;
  media_type?: string;
  seeAllHref?: string;
  showRank?: boolean;
}

export const MediaSliderSkeleton = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => (
  <section
    className={cn(
      "ps-8! lg:ps-24! md:py-6 pb-6 relative z-10 overflow-hidden lg:overflow-visible",
      className,
    )}
  >
    <div className="flex items-center justify-between mb-8 pe-8! lg:pe-24!">
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-8 bg-white/10 rounded-full" />
        <h2 className="text-2xl font-black tracking-tight text-white/20">
          {title}
        </h2>
      </div>
    </div>
    <div className="flex gap-4 md:gap-6 overflow-hidden!">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="w-[140px] sm:w-[140px] md:w-[160px] lg:w-[200px] flex-shrink-0 flex flex-col gap-3"
        >
          <Skeleton className="aspect-[2/3] w-full rounded-xl" />
          <div className="space-y-2 px-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </section>
);

const MediaSliderSwiper = dynamic(() => import("./MediaSliderSwiper"), {
  ssr: false,
  loading: (props) => <MediaSliderSkeleton title="" {...props} />,
});

const MediaSlider = (props: MediaSliderProps) => {
  return <MediaSliderSwiper {...props} />;
};

export default MediaSlider;
