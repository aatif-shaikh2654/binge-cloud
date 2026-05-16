import Herosection from "@/components/common/Herosection";
import MediaSlider from "@/components/common/MediaSlider";
import WatchHistory from "@/components/common/WatchHistory";
import {
  getMediaList,
  getTrendingMedia,
  getTrendingMovies,
} from "./services/all.service";
export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch trending movies on the server
  const trendingData = await getTrendingMovies();
  const movies = trendingData?.results || [];

  // Fetch popular movies and tv series
  const popularMoviesData = await getMediaList("movie", "popular");
  const popularSeriesData = await getMediaList("tv", "popular");

  // Fetch Top 10 Movies and Series of the week
  const top10MoviesData = await getTrendingMedia("movie", "week");
  const top10SeriesData = await getTrendingMedia("tv", "week");

  const popularMovies = popularMoviesData?.results?.slice(0, 20) || [];
  const popularSeries = popularSeriesData?.results?.slice(0, 20) || [];
  const top10Movies = top10MoviesData?.results?.slice(0, 10) || [];
  const top10Series = top10SeriesData?.results?.slice(0, 10) || [];

  return (
    <div className="flex flex-col w-full min-h-screen">
      <Herosection movies={movies} />
      <WatchHistory />
      <MediaSlider
        media_type="trending"
        title="Trending Movies"
        movies={movies}
      />
      <MediaSlider
        media_type="movie"
        title="Top 10 Movies"
        movies={top10Movies}
        showRank={true}
      />
      <MediaSlider
        media_type="movie"
        title="Popular Movies"
        movies={popularMovies}
      />
      <MediaSlider
        media_type="tv"
        title="Popular TV Series"
        movies={popularSeries}
      />
      <MediaSlider
        media_type="tv"
        title="Top 10 Series"
        movies={top10Series}
        showRank={true}
      />
    </div>
  );
}
