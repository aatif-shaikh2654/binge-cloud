import React from "react";
import { getMediaList } from "@/app/services/all.service";
import MediaList from "./MediaList";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ media_type: string }>;
}

export default async function MediaPage({ params }: PageProps) {
  const { media_type } = await params;

  // Map route names to TMDB types
  const typeMap: Record<string, "movie" | "tv"> = {
    movies: "movie",
    series: "tv",
  };

  const tmdbType = typeMap[media_type];

  if (!tmdbType) {
    notFound();
  }

  // Fetch first page on server
  const initialData = await getMediaList(tmdbType, "popular", 1);

  return (
    <div className="flex flex-col gap-8 pt-16 pb-12">
      <div className="px-8 lg:px-24">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-1.5 h-8 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
          <h1 className="text-3xl font-black tracking-tight text-white">
            {media_type === "movies" ? "Popular Movies" : "Trending Series"}
          </h1>
        </div>
        <p className="text-white/40 font-medium max-w-2xl">
          Discover our curated selection of top-rated {media_type}. From
          blockbusters to hidden gems, find everything you love here.
        </p>
      </div>

      <MediaList initialData={initialData} mediaType={tmdbType} />
    </div>
  );
}
