import AnimeHero from "@/components/common/AnimeHero";
import AnimeSearch from "@/components/common/AnimeSearch";
import AnimeSlider from "@/components/common/AnimeSlider";
import WatchHistory from "@/components/common/WatchHistory";
import {
  getPopularAnime,
  getTopRatedAnime,
  getTrendingAnime,
} from "../services/anilist.service";

export const dynamic = "force-dynamic";

export default async function AnimePage() {
  const [trendingData, popularData, topRatedData] = await Promise.all([
    getTrendingAnime(1, 20),
    getPopularAnime(1, 20),
    getTopRatedAnime(1, 20),
  ]);

  const trending = trendingData.media ?? [];
  const popular = popularData.media ?? [];
  const topRated = topRatedData.media ?? [];

  return (
    <div className="relative flex flex-col w-full min-h-screen">
      {/* Top Right Search Bar */}
      <AnimeSearch />

      <AnimeHero anime={trending} />

      <WatchHistory filterType="anime" />

      <div className="mt-8 space-y-2">
        <AnimeSlider
          title="Trending Now"
          anime={trending}
          seeAllHref="/anime/trending"
        />
        <AnimeSlider
          title="Most Popular"
          anime={popular}
          seeAllHref="/anime/popular"
        />
        <AnimeSlider
          title="Top Rated"
          anime={topRated}
          seeAllHref="/anime/top-rated"
        />
      </div>
    </div>
  );
}
