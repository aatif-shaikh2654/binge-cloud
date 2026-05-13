"use client";

import {
  type AniListNextAiringEpisode,
  type AniListStreamingEpisode,
} from "@/app/types/anilist";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

interface AnimeEpisodeSectionProps {
  animeId: number;
  totalEpisodes: number | null;
  streamingEpisodes: AniListStreamingEpisode[];
  nextAiringEpisode: AniListNextAiringEpisode | null;
}

const AnimeEpisodeSkeleton = () => (
  <section className="ps-8! lg:ps-24! md:py-6 pb-6 relative z-10">
    <div className="pe-8! lg:pe-24! border-b border-white/5 pb-4 md:pb-6 mb-8 space-y-2">
      <div className="w-24 h-3 bg-white/10 rounded-full" />
      <div className="w-36 h-8 bg-white/10 rounded-full" />
    </div>
    <div className="pe-8! lg:pe-24! grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <div className="space-y-1 px-1">
            <Skeleton className="h-2.5 w-1/2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  </section>
);

const AnimeEpisodeSectionContent = dynamic(
  () => import("./AnimeEpisodeSectionContent"),
  {
    ssr: false,
    loading: () => <AnimeEpisodeSkeleton />,
  },
);

const AnimeEpisodeSection = (props: AnimeEpisodeSectionProps) => {
  return <AnimeEpisodeSectionContent {...props} />;
};

export default AnimeEpisodeSection;
