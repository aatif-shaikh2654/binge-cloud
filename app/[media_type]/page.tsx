import { getMediaList } from "@/app/services/all.service";
import { notFound } from "next/navigation";
import MediaList from "./MediaList";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { media_type } = await params;
  const isMovies = media_type === "movies";

  return {
    title: isMovies ? "Popular Movies" : "Trending Series",
    description: `Discover our curated selection of top-rated ${media_type}. From blockbusters to hidden gems, find everything you love here.`,
  };
}

export const dynamic = "force-dynamic";

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
    <div className="flex flex-col gap-8 pt-8 pb-12">
      <div className="px-4 lg:px-24">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-1.5 h-8 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
          <h1 className="md:text-3xl text-2xl font-black tracking-tight text-white">
            {media_type === "movies" ? "Popular Movies" : "Trending Series"}
          </h1>
        </div>
        <p className="text-white/40 text-xs md:text-sm font-medium max-w-3xl">
          Discover our curated selection of top-rated {media_type}. From
          blockbusters to hidden gems, find everything you love here.
        </p>
      </div>

      <MediaList initialData={initialData} mediaType={tmdbType} />
    </div>
  );
}
