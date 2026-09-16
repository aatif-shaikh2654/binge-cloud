import { getAnimeDetails } from "@/features/anime/services/anilist.service";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AnimeWatch } from "@/features/anime";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ id?: string; ep?: string; lang?: string }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { id, ep } = await searchParams;

  if (!id) return { title: "Watch Anime" };

  try {
    const details = await getAnimeDetails(id);
    const title = details.title.english || details.title.romaji || "Anime";
    const displayTitle = ep ? `${title} — Episode ${ep}` : title;
    const imageUrl =
      details.bannerImage ||
      details.coverImage.extraLarge ||
      details.coverImage.large ||
      undefined;

    return {
      title: `Watching - ${displayTitle}`,
      description: `Now streaming ${displayTitle} on Binge Cloud.`,
      openGraph: imageUrl
        ? {
            images: [imageUrl],
          }
        : undefined,
    };
  } catch {
    return { title: "Watch Anime" };
  }
}

export default async function AnimeWatchPage({ searchParams }: PageProps) {
  const { id } = await searchParams;

  if (!id) notFound();

  // Fetch details on server side
  const animeDetails = await getAnimeDetails(id);

  return (
    <Suspense>
      <AnimeWatch id={id} initialDetails={animeDetails} />
    </Suspense>
  );
}
