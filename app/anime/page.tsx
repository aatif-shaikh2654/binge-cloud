import AnimeHero from "@/components/common/AnimeHero";
import { AnimeSliderSkeleton } from "@/components/common/AnimeSlider";
import { WatchHistorySkeleton } from "@/components/common/WatchHistory";
import {
  getPopularAnime,
  getTopRatedAnime,
  getTrendingAnime,
} from "../services/anilist.service";
import { getHistory } from "@/app/actions";
import { Suspense } from "react";
import nextDynamic from "next/dynamic";

const AnimeSearch = nextDynamic(() => import("@/components/common/AnimeSearch"), {
  ssr: false,
});
const WatchHistory = nextDynamic(() => import("@/components/common/WatchHistory"));
const AnimeSlider = nextDynamic(() => import("@/components/common/AnimeSlider"));

export const dynamic = "force-dynamic";

// Wrapper Server Components for Progressive Streaming (Below-the-fold)
async function WatchHistoryWrapper() {
  const initialHistory = await getHistory();
  return (
    <WatchHistory
      filterType="anime"
      initialHistory={initialHistory || undefined}
    />
  );
}

async function PopularAnimeWrapper() {
  const popularData = await getPopularAnime(1, 20);
  const popular = popularData.media ?? [];
  return (
    <AnimeSlider
      title="Most Popular"
      anime={popular}
      seeAllHref="/anime/popular"
    />
  );
}

async function TopRatedAnimeWrapper() {
  const topRatedData = await getTopRatedAnime(1, 20);
  const topRated = topRatedData.media ?? [];
  return (
    <AnimeSlider
      title="Top Rated"
      anime={topRated}
      seeAllHref="/anime/top-rated"
    />
  );
}

export default async function AnimePage() {
  // Eagerly fetch trending anime on the server to render above-the-fold content immediately
  const trendingData = await getTrendingAnime(1, 20);
  const trending = trendingData.media ?? [];

  return (
    <div className="relative flex flex-col w-full min-h-screen">
      {/* Search Bar - Loaded dynamically on the client */}
      <AnimeSearch />

      {/* Render eagerly */}
      <AnimeHero anime={trending} />

      {/* Lazy loaded and progressively streamed below-the-fold */}
      <Suspense fallback={<WatchHistorySkeleton />}>
        <WatchHistoryWrapper />
      </Suspense>

      <div className="mt-8 space-y-2">
        <Suspense fallback={<AnimeSliderSkeleton title="Trending Now" />}>
          <AnimeSlider
            title="Trending Now"
            anime={trending}
            seeAllHref="/anime/trending"
          />
        </Suspense>

        <Suspense fallback={<AnimeSliderSkeleton title="Most Popular" />}>
          <PopularAnimeWrapper />
        </Suspense>

        <Suspense fallback={<AnimeSliderSkeleton title="Top Rated" />}>
          <TopRatedAnimeWrapper />
        </Suspense>
      </div>
    </div>
  );
}
