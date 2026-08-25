"use client";

import { type AniListRelationEdge } from "@/app/types/anilist";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

interface AnimeRelationsProps {
  relations: AniListRelationEdge[];
}

const AnimeRelationsSkeleton = () => (
  <section className="ps-8! lg:ps-24! md:py-6 pb-6 relative z-10 overflow-hidden">
    <div className="pe-8! lg:pe-24! border-b border-white/5 pb-4 md:pb-6 mb-8 space-y-2">
      <div className="w-24 h-3 bg-white/10 rounded-full" />
      <div className="w-44 h-8 bg-white/10 rounded-full" />
    </div>
    <div className="flex gap-4 md:gap-6 overflow-hidden!">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="w-[120px] sm:w-[140px] md:w-[160px] shrink-0 flex flex-col gap-3"
        >
          <Skeleton className="aspect-2/3 w-full rounded-xl" />
          <div className="space-y-1.5 px-1">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-2.5 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </section>
);

const AnimeRelationsSwiper = dynamic(() => import("./AnimeRelationsSwiper"), {
  ssr: false,
  loading: () => <AnimeRelationsSkeleton />,
});

const AnimeRelations = (props: AnimeRelationsProps) => {
  return <AnimeRelationsSwiper {...props} />;
};

export default AnimeRelations;
