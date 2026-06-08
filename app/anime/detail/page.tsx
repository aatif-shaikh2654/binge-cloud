import { getAnimeDetails } from "@/app/services/anilist.service";
import { notFound } from "next/navigation";
import AnimeDetail from "./AnimeDetail";
import type { Metadata } from "next";
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ id: string }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { id } = await searchParams;

  if (!id) return { title: "Anime Detail" };

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

export default async function AnimeDetailPage({ searchParams }: PageProps) {
  const { id } = await searchParams;

  if (!id) notFound();

  let details;
  try {
    details = await getAnimeDetails(id);
  } catch (error) {
    console.error("Error loading anime detail:", error);
    notFound();
  }

  return <AnimeDetail details={details} />;
}
