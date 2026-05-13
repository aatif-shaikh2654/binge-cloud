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

  return (
    <Suspense>
      <AnimeWatch id={id} />
    </Suspense>
  );
}
