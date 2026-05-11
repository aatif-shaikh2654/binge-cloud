import Herosection from "@/components/common/Herosection";
import MediaSlider from "@/components/common/MediaSlider";
import WatchHistory from "@/components/common/WatchHistory";
import { getTrendingMovies, getMediaList } from "./services/all.service";
export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch trending movies on the server
  const trendingData = await getTrendingMovies();
  const movies = trendingData?.results || [];

  // Fetch popular movies and tv series
  const popularMoviesData = await getMediaList("movie", "popular");
  const popularSeriesData = await getMediaList("tv", "popular");

  const popularMovies = popularMoviesData?.results?.slice(0, 20) || [];
  const popularSeries = popularSeriesData?.results?.slice(0, 20) || [];

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
        title="Popular Movies"
        movies={popularMovies}
      />
      <MediaSlider
        media_type="tv"
        title="Popular TV Series"
        movies={popularSeries}
      />
    </div>
  );
}
