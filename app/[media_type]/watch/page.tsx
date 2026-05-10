import { getMediaDetails } from "@/app/services/all.service";
import { notFound } from "next/navigation";
import Watch from "./Watch";
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
  };

  const tmdbType = typeMap[media_type] || (media_type as "movie" | "tv");

  // Fetch details to get seasons for TV shows
  let seasons = undefined;
  if (tmdbType === "tv") {
    const details = await getMediaDetails(id, "tv");
    seasons = details?.seasons;
  }

  return <Watch id={id} tmdbType={tmdbType} seasons={seasons} />;
}
