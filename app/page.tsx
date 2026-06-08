import { getHistory } from "@/app/actions";
import Herosection from "@/components/common/Herosection";
import { SliderSkeleton } from "@/components/common/SliderSkeleton";
import { WatchHistorySkeleton } from "@/components/common/WatchHistory";
import nextDynamic from "next/dynamic";
import { Suspense } from "react";
import {
  getMediaList,
  getTrendingMedia,
  getTrendingMovies,
} from "./services/all.service";

const WatchHistory = nextDynamic(
  () => import("@/components/common/WatchHistory"),
);
const MediaSlider = nextDynamic(
  () => import("@/components/common/MediaSlider"),
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

      <Suspense fallback={<SliderSkeleton title="Top 10 Series" />}>
        <Top10SeriesWrapper />
      </Suspense>
    </div>
  );
}
