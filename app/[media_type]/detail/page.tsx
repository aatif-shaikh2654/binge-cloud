import { getMediaCredits, getMediaDetails } from "@/app/services/all.service";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Detail from "./Detail";
import { type MediaType } from "@/app/types/common";

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { media_type } = await params;
  const { id } = await searchParams;

  const typeMap: Record<string, MediaType> = {
    movie: "movie",
    tv: "tv",
  };

  const tmdbType = typeMap[media_type] || (media_type as MediaType);

  try {
    const details = await getMediaDetails(id, tmdbType);
    if (!details) return { title: "Detail" };

    const title = details.title || details.name;
    return {
      title: title,
      description: details.overview,
      openGraph: {
        images: [
          `https://image.tmdb.org/t/p/w1280${details.backdrop_path || details.poster_path}`,
        ],
      },
    };
  } catch {
    return { title: "Detail" };
  }
}

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ media_type: string }>;
  searchParams: Promise<{ id: string }>;
}

export default async function WatchPage({ params, searchParams }: PageProps) {
  const { media_type } = await params;
  const { id } = await searchParams;

  if (!id) {
    notFound();
  }

  // Map route names to TMDB types
  const typeMap: Record<string, MediaType> = {
    movie: "movie",
    tv: "tv",
    trending: "movie", // Default to movie for trending if not specified
  };

  const tmdbType = typeMap[media_type] || (media_type as MediaType);

  let details, credits;
  try {
    [details, credits] = await Promise.all([
      getMediaDetails(id, tmdbType),
      getMediaCredits(id, tmdbType),
    ]);
  } catch (error) {
    console.error("Error loading watch page:", error);
    notFound();
  }

  return <Detail details={details} credits={credits} tmdbType={tmdbType} />;
}
