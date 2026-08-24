import React from "react";
import { discoverMedia } from "@/app/services/all.service";
import PageHeader from "@/components/common/PageHeader";
import MediaList from "@/app/[media_type]/MediaList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bollywood Movies - Binge Cloud",
  description: "Explore the ultimate list of Bollywood movies on Binge Cloud. Filter by genres, release year, streaming platforms, and sort by popularity.",
};

export const dynamic = "force-dynamic";

export default async function BollywoodPage() {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const threeYearsAgo = new Date();
  threeYearsAgo.setFullYear(today.getFullYear() - 3);
  const threeYearsAgoStr = threeYearsAgo.toISOString().split("T")[0];

  // Fetch initial page of Bollywood movies sorted by popularity (restricted to last 3 years, matching the Bollywood slider)
  const movieData = await discoverMedia("movie", {
    with_original_language: "hi",
    with_origin_country: "IN",
    sort_by: "popularity.desc",
    "primary_release_date.gte": threeYearsAgoStr,
    "primary_release_date.lte": todayStr,
    page: 1,
  });

  return (
    <div className="flex flex-col gap-8 pt-10 pb-12 min-h-screen bg-background">
      <PageHeader
        title="Bollywood Movies"
        description="Explore the latest Bollywood hits and Hindi movies from India. Filter by genres, release year, streaming platforms, or sort by release date and popularity."
      />

      <MediaList
        initialData={movieData}
        mediaType="movie"
        isBollywood={true}
      />
    </div>
  );
}
