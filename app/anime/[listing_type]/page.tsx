import {
  getPopularAnime,
  getTopRatedAnime,
  getTrendingAnime,
  getAnimeByGenre,
  getAnimeMovies,
} from "@/features/anime/services/anilist.service";
import { AnimeCategory, type AniListPageResponse } from "@/features/anime/types/anilist";
import PageHeader from "@/shared/components/layout/PageHeader";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnimeList } from "@/features/anime";

export const dynamic = "force-dynamic";

const ANILIST_GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Ecchi",
  "Fantasy",
  "Hentai",
  "Horror",
  "Mahou Shoujo",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
];

function findAniListGenre(slug: string): string | undefined {
  const normalized = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
  return ANILIST_GENRES.find(
    (g) => g.toLowerCase().replace(/[^a-z0-9]/g, "") === normalized,
  );
}

interface PageProps {
  params: Promise<{ listing_type: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { listing_type } = await params;

  const typeMap: Record<string, string> = {
    trending: "Trending Anime",
    popular: "Most Popular Anime",
    "top-rated": "Top Rated Anime",
    movies: "Popular Anime Movies",
  };

  const title = typeMap[listing_type];
  if (title) {
    return { title };
  }

  const matchedGenre = findAniListGenre(listing_type);
  if (matchedGenre) {
    return {
      title: `${matchedGenre} Anime`,
      description: `Explore the best ${matchedGenre.toLowerCase()} anime series on Binge Cloud.`,
    };
  }

  return {};
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
    movies: {
      title: "Popular Anime Movies",
      description:
        "Explore the best and most popular anime movies of all time on Binge Cloud.",
      fetcher: getAnimeMovies,
      category: "movies",
    },
  };

  const config = typeMap[listing_type];

  if (config) {
    const initialData = await config.fetcher(1);
    return (
      <div className="flex flex-col gap-8 pt-10 pb-12">
        <PageHeader title={config.title} description={config.description} />
        <AnimeList initialData={initialData} category={config.category} />
      </div>
    );
  }

  const matchedGenre = findAniListGenre(listing_type);
  if (matchedGenre) {
    const initialData = await getAnimeByGenre([matchedGenre], undefined, 1);
    return (
      <div className="flex flex-col gap-8 pt-10 pb-12">
        <PageHeader
          title={`${matchedGenre} Anime`}
          description={`Discover our curated selection of top-rated ${matchedGenre.toLowerCase()} anime series on Binge Cloud.`}
        />
        <AnimeList initialData={initialData} genre={matchedGenre} />
      </div>
    );
  }

  notFound();
}

