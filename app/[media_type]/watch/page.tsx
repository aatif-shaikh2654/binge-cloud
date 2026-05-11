import { getMediaDetails } from "@/app/services/all.service";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Watch from "./Watch";

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { media_type } = await params;
  const { id } = await searchParams;

  const typeMap: Record<string, "movie" | "tv"> = {
    movie: "movie",
    tv: "tv",
  };

  const tmdbType = typeMap[media_type] || (media_type as "movie" | "tv");

  try {
    const details = await getMediaDetails(id, tmdbType);
    if (!details) return { title: "Watch" };

    const title = details.title || details.name;
    return {
      title: `Watching - ${title}`,
      description: `Now streaming ${title} on Binge Cloud.`,
    };
  } catch {
    return { title: "Watch" };
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
  const typeMap: Record<string, "movie" | "tv"> = {
    movie: "movie",
    tv: "tv",
  };

  const tmdbType = typeMap[media_type] || (media_type as "movie" | "tv");

  // Fetch details to get seasons for TV shows and media info for history
  const details = await getMediaDetails(id, tmdbType);
  const seasons = details?.seasons;

  return <Watch id={id} tmdbType={tmdbType} seasons={seasons} details={details} />;
}
