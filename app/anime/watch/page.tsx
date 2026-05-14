import { getAnimeDetails } from "@/app/services/anilist.service";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import AnimeWatch from "./AnimeWatch";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ id?: string; ep?: string; lang?: string }>;
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
