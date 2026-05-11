import { getMediaList } from "@/app/services/all.service";
import { notFound } from "next/navigation";
import MediaList from "./MediaList";
import type { Metadata } from "next";
import PageHeader from "@/components/common/PageHeader";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { media_type } = await params;
  const isMovies = media_type === "movie";

  return {
    title: isMovies ? "Popular Movies" : "Popular TV Series",
    description: `Discover our curated selection of top-rated ${media_type === "movie" ? "movies" : "TV series"}. From blockbusters to hidden gems, find everything you love here.`,
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
    movie: "movie",
    tv: "tv",
  };

  const tmdbType = typeMap[media_type];

  if (!tmdbType) {
    notFound();
  }

  // Fetch first page on server
  const initialData = await getMediaList(tmdbType, "popular", 1);

  return (
    <div className="flex flex-col gap-8 pt-8 pb-12">
      <PageHeader
        title={media_type === "movie" ? "Popular Movies" : "Popular TV Series"}
        description={`Discover our curated selection of top-rated ${media_type === "movie" ? "movies" : "TV series"}. From blockbusters to hidden gems, find everything you love here.`}
      />

      <MediaList initialData={initialData} mediaType={tmdbType} />
    </div>
  );
}
