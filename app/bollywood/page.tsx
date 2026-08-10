import React from "react";
import { discoverMedia } from "@/app/services/all.service";
import PageHeader from "@/components/common/PageHeader";
import MediaList from "@/app/[media_type]/MediaList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bollywood Catalog - Binge Cloud",
  description: "Explore the ultimate list of Bollywood movies and web series on Binge Cloud. Filter by genres, release year, streaming platforms, and sort by popularity.",
};

export const dynamic = "force-dynamic";

export default async function BollywoodPage() {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const threeYearsAgo = new Date();
  threeYearsAgo.setFullYear(today.getFullYear() - 3);
  const threeYearsAgoStr = threeYearsAgo.toISOString().split("T")[0];

  // Fetch initial page of Bollywood movies and TV shows in parallel, sorted by popularity (restricted to last 3 years)
  const [movieData, tvData] = await Promise.all([
    discoverMedia("movie", {
      with_original_language: "hi",
      with_origin_country: "IN",
      sort_by: "popularity.desc",
      "primary_release_date.gte": threeYearsAgoStr,
      "primary_release_date.lte": todayStr,
      page: 1,
    }),
    discoverMedia("tv", {
      with_original_language: "hi",
      with_origin_country: "IN",
      sort_by: "popularity.desc",
      "first_air_date.gte": threeYearsAgoStr,
      "first_air_date.lte": todayStr,
      page: 1,
    }),
  ]);

  const movies = (movieData?.results || []).map((m) => ({
    ...m,
    media_type: "movie" as const,
  }));

  const tvShows = (tvData?.results || []).map((t) => ({
    ...t,
    media_type: "tv" as const,
  }));

  // Combine and sort by popularity (latest popular hits first)
  const combined = [...movies, ...tvShows].sort(
    (a, b) => (b.popularity || 0) - (a.popularity || 0)
  );

  const initialData = {
    page: 1,
    results: combined,
    total_pages: Math.max(movieData?.total_pages || 1, tvData?.total_pages || 1),
    total_results: (movieData?.total_results || 0) + (tvData?.total_results || 0),
  };

  return (
    <div className="flex flex-col gap-8 pt-10 pb-12 min-h-screen bg-background">
      <PageHeader
        title="Bollywood Catalog"
        description="Explore the latest Hindi movies and web series from India. Filter by genres, release year, streaming platforms, or sort by release date and popularity."
      />

      <MediaList
        initialData={initialData}
        mediaType="all"
        isBollywood={true}
      />
    </div>
  );
}
