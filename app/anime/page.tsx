import AnimeHero from "@/components/common/AnimeHero";
import AnimeSlider from "@/components/common/AnimeSlider";
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
    <div className="flex flex-col w-full min-h-screen">
      <AnimeHero anime={trending} />
      <div className="mt-8 space-y-2">
        <AnimeSlider title="Trending Now" anime={trending} />
        <AnimeSlider title="Most Popular" anime={popular} />
        <AnimeSlider title="Top Rated" anime={topRated} />
      </div>
    </div>
  );
}
