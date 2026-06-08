import {
  getMediaDetails,
  getMediaList,
  getSimilarMedia,
} from "@/app/services/all.service";
import { type MediaType } from "@/app/types/common";
import PageHeader from "@/components/common/PageHeader";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MediaList from "./MediaList";

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const [{ media_type }, { related_to }] = await Promise.all([
    params,
    searchParams,
  ]);
  const isMovies = media_type === "movie";

  if (related_to) {
    try {
      const details = await getMediaDetails(
        related_to,
        media_type === "movie" ? "movie" : "tv",
      );
      const title = details.title || details.name;
      return {
        title: `Related to ${title}`,
        description: `Explore more titles like ${title}. Discover similar stories and characters you'll love.`,
      };
    } catch {
      return { title: isMovies ? "Popular Movies" : "Popular TV Series" };
    }
  }

  return {
    title: isMovies ? "Popular Movies" : "Popular TV Series",
    description: `Discover our curated selection of top-rated ${media_type === "movie" ? "movies" : "TV series"}. From blockbusters to hidden gems, find everything you love here.`,
  };
}

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ media_type: string }>;
  searchParams: Promise<{ related_to?: string }>;
}

export default async function MediaPage({ params, searchParams }: PageProps) {
  const [{ media_type }, { related_to }] = await Promise.all([
    params,
    searchParams,
  ]);

  // Map route names to TMDB types
  const typeMap: Record<string, MediaType> = {
    movie: "movie",
    tv: "tv",
  };

  const tmdbType = typeMap[media_type];

  if (!tmdbType) {
    notFound();
  }

  let initialData;
  let title = media_type === "movie" ? "Popular Movies" : "Popular TV Series";
  let description = `Discover our curated selection of top-rated ${media_type === "movie" ? "movies" : "TV Series"}. From blockbusters to hidden gems, find everything you love here.`;

  if (related_to) {
    try {
      const [mediaData, details] = await Promise.all([
        getSimilarMedia(related_to, tmdbType, 1),
        getMediaDetails(related_to, tmdbType),
      ]);
      initialData = mediaData;
      const mediaTitle = details.title || details.name;
      title = `Related to ${mediaTitle}`;
      description = `Explore more titles like ${mediaTitle}. Discover similar stories and characters you'll love.`;
    } catch {
      initialData = await getMediaList(tmdbType, "popular", 1);
    }
  } else {
    // Fetch first page on server
    initialData = await getMediaList(tmdbType, "popular", 1);
  }

  return (
    <div className="flex flex-col gap-8 pt-10 pb-12">
      <PageHeader title={title} description={description} />

      <MediaList
        initialData={initialData}
        mediaType={tmdbType}
        relatedTo={related_to}
      />
    </div>
  );
}
