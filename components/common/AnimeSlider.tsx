"use client";

import { type AniListMedia } from "@/app/types/anilist";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

interface AnimeSliderProps {
  anime: AniListMedia[];
  title: string;
  className?: string;
  seeAllHref?: string;
}

const AnimeSliderSkeleton = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => (
  <section
    className={cn(
      "ps-8! lg:ps-24! md:py-6 pb-6 relative z-10 overflow-hidden md:overflow-visible",
      className,
    )}
  >
    <div className="flex items-center justify-between mb-8 pe-8! lg:pe-24!">
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-8 bg-white/10 rounded-full" />
        <h2 className="text-2xl font-black tracking-tight text-white/20">{title}</h2>
      </div>
    </div>
    <div className="flex gap-4 md:gap-6 overflow-hidden!">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="w-[140px] sm:w-[180px] md:w-[200px] lg:w-[240px] flex-shrink-0 flex flex-col gap-3"
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

const AnimeSliderSwiper = dynamic(() => import("./AnimeSliderSwiper"), {
  ssr: false,
  loading: (props) => <AnimeSliderSkeleton title="" {...props} />,
});

const AnimeSlider = (props: AnimeSliderProps) => {
  return <AnimeSliderSwiper {...props} />;
};

export default AnimeSlider;
