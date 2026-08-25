import { getMediaDetails } from "@/features/media/services/all.service";
import { type MediaType } from "@/shared/types/common";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Watch } from "@/features/media";

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const [{ media_type }, { id }] = await Promise.all([params, searchParams]);

  const typeMap: Record<string, MediaType> = {
    movie: "movie",
    tv: "tv",
  };

  const tmdbType = typeMap[media_type] || (media_type as MediaType);

  try {
    const details = await getMediaDetails(id, tmdbType);
    if (!details) return { title: "Watch" };

    const title = details.title || details.name;
    const imageUrl =
      details.backdrop_path || details.poster_path
        ? `https://image.tmdb.org/t/p/w1280${details.backdrop_path || details.poster_path}`
        : undefined;

    return {
      title: `Watching - ${title}`,
      description: `Now streaming ${title} on Binge Cloud.`,
      openGraph: imageUrl
        ? {
            images: [imageUrl],
          }
        : undefined,
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
  const [{ media_type }, { id }] = await Promise.all([params, searchParams]);

  if (!id) {
    notFound();
  }

  // Map route names to TMDB types
  const typeMap: Record<string, MediaType> = {
    movie: "movie",
    tv: "tv",
  };

  const tmdbType = typeMap[media_type] || (media_type as MediaType);

  // Fetch details to get seasons for TV shows and media info for history
  const details = await getMediaDetails(id, tmdbType);
  const seasons = details?.seasons;

  return (
    <Watch id={id} tmdbType={tmdbType} seasons={seasons} details={details} />
  );
}
