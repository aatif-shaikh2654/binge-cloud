import { getHistory } from "@/app/actions";
import Herosection from "@/components/common/Herosection";
import { SliderSkeleton } from "@/components/sliders/SliderSkeleton";
import { WatchHistorySkeleton } from "@/components/sliders/WatchHistory";
import nextDynamic from "next/dynamic";
import { Suspense } from "react";
import {
  discoverMedia,
  getMediaList,
  getTrendingMedia,
  getTrendingMovies,
} from "./services/all.service";

const WatchHistory = nextDynamic(
  () => import("@/components/sliders/WatchHistory"),
);
const MediaSlider = nextDynamic(
  () => import("@/components/sliders/MediaSlider"),
);
const StreamingPlatforms = nextDynamic(
  () => import("@/components/sliders/StreamingPlatforms"),
);

export const dynamic = "force-dynamic";

// Wrapper Server Components for Progressive Streaming (Below-the-fold)
async function WatchHistoryWrapper() {
  const initialHistory = await getHistory();
  return <WatchHistory initialHistory={initialHistory || undefined} />;
}

async function Top10MoviesWrapper() {
  const top10MoviesData = await getTrendingMedia("movie", "week");
  const top10Movies = top10MoviesData?.results?.slice(0, 10) || [];
  return (
    <MediaSlider
      media_type="movie"
      title="Top 10 Movies"
      movies={top10Movies}
      showRank={true}
      seeAllHref="/movie?filter=trending"
    />
  );
}

async function PopularMoviesWrapper() {
  const popularMoviesData = await getMediaList("movie", "popular");
  const popularMovies = popularMoviesData?.results?.slice(0, 20) || [];
  return (
    <MediaSlider
      media_type="movie"
      title="Popular Movies"
      movies={popularMovies}
    />
  );
}

async function PopularSeriesWrapper() {
  const popularSeriesData = await getMediaList("tv", "popular");
  const popularSeries = popularSeriesData?.results?.slice(0, 20) || [];
  return (
    <MediaSlider
      media_type="tv"
      title="Popular TV Series"
      movies={popularSeries}
    />
  );
}

async function Top10SeriesWrapper() {
  const top10SeriesData = await getTrendingMedia("tv", "week");
  const top10Series = top10SeriesData?.results?.slice(0, 10) || [];
  return (
    <MediaSlider
      media_type="tv"
      title="Top 10 Series"
      movies={top10Series}
      showRank={true}
      seeAllHref="/tv?filter=trending"
    />
  );
}

async function BollywoodMoviesWrapper() {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const threeYearsAgo = new Date();
  threeYearsAgo.setFullYear(today.getFullYear() - 3);
  const threeYearsAgoStr = threeYearsAgo.toISOString().split("T")[0];

  const bollywoodMoviesData = await discoverMedia("movie", {
    with_original_language: "hi",
    with_origin_country: "IN",
    sort_by: "popularity.desc",
    "primary_release_date.gte": threeYearsAgoStr,
    "primary_release_date.lte": todayStr,
    page: 1,
  });
  const bollywoodMovies = (bollywoodMoviesData?.results?.slice(0, 20) || []).map((m) => ({
    ...m,
    media_type: "movie" as const,
  }));
  return (
    <MediaSlider
      media_type="movie"
      title="Latest Bollywood Hits"
      movies={bollywoodMovies}
      seeAllHref="/bollywood"
    />
  );
}

export default async function Home() {
  // Eagerly fetch trending movies at the page level to render above-the-fold instantly
  const trendingData = await getTrendingMovies();
  const movies = trendingData?.results || [];

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Render eagerly on the server */}
      <Herosection movies={movies} />

      {/* Lazy loaded and progressively streamed below-the-fold */}
      <Suspense fallback={<WatchHistorySkeleton />}>
        <WatchHistoryWrapper />
      </Suspense>

      <Suspense fallback={<SliderSkeleton title="Streaming Platforms" />}>
        <StreamingPlatforms />
      </Suspense>

      <Suspense fallback={<SliderSkeleton title="Trending" />}>
        <MediaSlider title="Trending" movies={movies} />
      </Suspense>

      <Suspense fallback={<SliderSkeleton title="Top 10 Movies" />}>
        <Top10MoviesWrapper />
      </Suspense>

      <Suspense fallback={<SliderSkeleton title="Popular Movies" />}>
        <PopularMoviesWrapper />
      </Suspense>

      <Suspense fallback={<SliderSkeleton title="Popular TV Series" />}>
        <PopularSeriesWrapper />
      </Suspense>

      <Suspense fallback={<SliderSkeleton title="Latest Bollywood Hits" />}>
        <BollywoodMoviesWrapper />
      </Suspense>

      <Suspense fallback={<SliderSkeleton title="Top 10 Series" />}>
        <Top10SeriesWrapper />
      </Suspense>
    </div>
  );
}
