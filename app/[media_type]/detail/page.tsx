import { getMediaCredits, getMediaDetails } from "@/app/services/all.service";
import { notFound } from "next/navigation";
import Detail from "./Detail";
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
  const typeMap: Record<string, "movie" | "tv"> = {
    movies: "movie",
    series: "tv",
    movie: "movie",
    tv: "tv",
    trending: "movie", // Default to movie for trending if not specified
  };

  const tmdbType = typeMap[media_type] || (media_type as "movie" | "tv");

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
