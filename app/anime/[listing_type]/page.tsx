import {
  getPopularAnime,
  getTopRatedAnime,
  getTrendingAnime,
} from "@/app/services/anilist.service";
import { AnimeCategory, type AniListPageResponse } from "@/app/types/anilist";
import PageHeader from "@/components/common/PageHeader";
import { notFound } from "next/navigation";
import AnimeList from "../_components/AnimeList";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ listing_type: string }>;
}

export default async function AnimeListingPage({ params }: PageProps) {
  const { listing_type } = await params;

  const typeMap: Record<
    string,
    {
      title: string;
      description: string;
      fetcher: (
        page?: number,
        perPage?: number,
      ) => Promise<AniListPageResponse>;
      category: AnimeCategory;
    }
  > = {
    trending: {
      title: "Trending Anime",
      description:
        "Discover the most talked-about anime series currently airing. From seasonal hits to rising favorites, stay up to date with the latest trends.",
      fetcher: getTrendingAnime,
      category: "trending",
    },
    popular: {
      title: "Most Popular Anime",
      description:
        "Explore the anime series that have captured the hearts of fans worldwide. Browse through the most-watched and highly-acclaimed titles of all time.",
      fetcher: getPopularAnime,
      category: "popular",
    },
    "top-rated": {
      title: "Top Rated Anime",
      description:
        "Discover the highest-rated anime series as voted by the community. Find top-tier storytelling and animation across all genres.",
      fetcher: getTopRatedAnime,
      category: "top-rated",
    },
  };

  const config = typeMap[listing_type];

  if (!config) {
    notFound();
  }

  const initialData = await config.fetcher(1);

  return (
    <div className="flex flex-col gap-8 pt-10 pb-12">
      <PageHeader title={config.title} description={config.description} />

      <AnimeList initialData={initialData} category={config.category} />
    </div>
  );
}
