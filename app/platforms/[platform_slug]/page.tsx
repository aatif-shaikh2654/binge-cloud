import React from "react";
import { notFound } from "next/navigation";
import { discoverMedia } from "@/features/media/services/all.service";
import PageHeader from "@/shared/components/layout/PageHeader";
import MediaList from "@/features/media/components/MediaList";
import type { Metadata } from "next";
import { PLATFORMS } from "@/features/media/constants/platforms";

interface PageProps {
  params: Promise<{ platform_slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { platform_slug } = await params;
  const platform = PLATFORMS.find(p => p.slug === platform_slug);

  if (!platform) {
    return { title: "Streaming Catalog" };
  }

  return {
    title: `${platform.name} Catalog`,
    description: `Explore all movies and TV shows streaming on ${platform.name}. Find blockbusters and trending titles.`,
  };
}

export const dynamic = "force-dynamic";

export default async function PlatformPage({ params }: PageProps) {
  const { platform_slug } = await params;
  const platform = PLATFORMS.find(p => p.slug === platform_slug);

  if (!platform) {
    notFound();
  }

  // Fetch initial page data (movies on this platform)
  let initialData;
  try {
    initialData = await discoverMedia("movie", {
      with_watch_providers: platform.id,
      watch_region: "US",
      with_watch_monetization_types: "flatrate",
      page: 1,
    });
  } catch (error) {
    console.error("Failed to fetch initial platform media:", error);
    initialData = { results: [], page: 1, total_pages: 1, total_results: 0 };
  }

  return (
    <div className="flex flex-col gap-8 pt-10 pb-12">
      <PageHeader
        title={`${platform.name} Catalog`}
        description={`Explore all movies and TV shows streaming on ${platform.name}. Filter by genres, release year, or sort by popularity.`}
      />

      <MediaList
        initialData={initialData}
        mediaType="movie"
        platformId={platform.id}
      />
    </div>
  );
}
