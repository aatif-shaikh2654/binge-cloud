import { getMediaCredits, getMediaDetails } from "@/app/services/all.service";
import { getAnimeDetails } from "@/app/services/anilist.service";
import { type MediaType } from "@/app/types/common";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AnimeDetail from "./AnimeDetail";
import Detail from "./Detail";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ media_type: string }>;
  searchParams: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { media_type } = await params;
  const { id } = await searchParams;

  if (media_type === "anime") {
    try {
      const details = await getAnimeDetails(id);
      const title = details.title.english || details.title.romaji || "Anime";
      return {
        title,
        description: details.description?.replace(/<[^>]*>/g, "") ?? undefined,
        openGraph: {
          images: details.bannerImage
            ? [details.bannerImage]
            : details.coverImage.extraLarge
              ? [details.coverImage.extraLarge]
              : [],
        },
      };
    } catch {
      return { title: "Anime Detail" };
    }
  }

  const typeMap: Record<string, "movie" | "tv"> = { movie: "movie", tv: "tv" };
  const tmdbType = typeMap[media_type] || (media_type as "movie" | "tv");

  try {
    const details = await getMediaDetails(id, tmdbType);
    if (!details) return { title: "Detail" };
    return {
      title: details.title || details.name,
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

export default async function DetailPage({ params, searchParams }: PageProps) {
  const { media_type } = await params;
  const { id } = await searchParams;

  if (!id) notFound();

  // ── Anime branch ─────────────────────────────────────────────────────────────
  if (media_type === "anime") {
    let details;
    try {
      details = await getAnimeDetails(id);
    } catch (error) {
      console.error("Error loading anime detail:", error);
      notFound();
    }
    return <AnimeDetail details={details} />;
  }

  // Map route names to TMDB types
  const typeMap: Record<string, MediaType> = {
    movie: "movie",
    tv: "tv",
    trending: "movie",
  };

  const tmdbType = typeMap[media_type] || (media_type as MediaType);

  let details, credits;
  try {
    [details, credits] = await Promise.all([
      getMediaDetails(id, tmdbType),
      getMediaCredits(id, tmdbType),
    ]);
  } catch (error) {
    console.error("Error loading detail page:", error);
    notFound();
  }

  return <Detail details={details} credits={credits} tmdbType={tmdbType} />;
}
