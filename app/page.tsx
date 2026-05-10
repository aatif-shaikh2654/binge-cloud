import Herosection from "@/components/common/Herosection";
import { getTrendingMovies } from "./services/all.service";
import MediaSlider from "@/components/common/MediaSlider";

export default async function Home() {
  // Fetch trending movies on the server
  const trendingData = await getTrendingMovies();
  const movies = trendingData?.results || [];

  return (
    <div className="flex flex-col w-full min-h-screen">
      <Herosection movies={movies} />
      <MediaSlider
        media_type="trending"
        title="Trending Movies"
        movies={movies}
      />
    </div>
  );
}
