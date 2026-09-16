import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHeader from "@/shared/components/layout/PageHeader";
import { discoverMedia } from "@/features/media/services/all.service";
import { TMDB_GENRES } from "@/features/media/constants/tmdb";
import { MediaList } from "@/features/media";

// Normalize and find genre helper
export function findTmdbGenre(slug: string): { id: number; name: string } | undefined {
  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug);
  } catch {}
  const normalized = decoded.toLowerCase().replace(/[^a-z0-9]/g, "");
  const found = Object.entries(TMDB_GENRES).find(([, name]) => {
    const nameNorm = name.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (nameNorm === normalized) return true;
    // Map "science-fiction" or "sciencefiction" to TMDB "Sci-Fi"
    if (normalized === "sciencefiction" && nameNorm === "scifi") return true;
    if (normalized === "scifi" && nameNorm === "sciencefiction") return true;
    // Map "science-fiction-&-fantasy" to TMDB "Sci-Fi & Fantasy"
    if (normalized === "sciencefictionfantasy" && nameNorm === "scififantasy") return true;
    if (normalized === "scififantasy" && nameNorm === "sciencefictionfantasy") return true;
    return false;
  });
  if (found) {
    return { id: parseInt(found[0]), name: found[1] };
  }
  return undefined;
}

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ media_type: string; genre: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { media_type, genre } = await params;

  // Validate type
  const typeMap: Record<string, "movie" | "tv"> = {
    movie: "movie",
    tv: "tv",
    series: "tv",
  };

  const tmdbType = typeMap[media_type];
  if (!tmdbType) {
    return {};
  }

  const genreInfo = findTmdbGenre(genre);
  if (!genreInfo) {
    return {};
  }

  const label = tmdbType === "movie" ? "Movies" : "TV Series";
  return {
    title: `${genreInfo.name} ${label}`,
    description: `Explore the best ${genreInfo.name.toLowerCase()} ${label.toLowerCase()} on Binge Cloud.`,
  };
}

export default async function GenrePage({ params }: PageProps) {
  const { media_type, genre } = await params;

  const typeMap: Record<string, "movie" | "tv"> = {
    movie: "movie",
    tv: "tv",
    series: "tv",
  };

  const tmdbType = typeMap[media_type];
  if (!tmdbType) {
    notFound();
  }

  const genreInfo = findTmdbGenre(genre);
  if (!genreInfo) {
    notFound();
  }

  // Fetch initial data
  const initialData = await discoverMedia(tmdbType, {
    with_genres: genreInfo.id.toString(),
    page: 1,
  });

  const label = tmdbType === "movie" ? "Movies" : "TV Series";
  const title = `${genreInfo.name} ${label}`;
  const description = `Discover our curated selection of top-rated ${genreInfo.name.toLowerCase()} ${label.toLowerCase()} on Binge Cloud.`;

  return (
    <div className="flex flex-col gap-8 pt-10 pb-12">
      <PageHeader title={title} description={description} />
      <MediaList
        initialData={initialData}
        mediaType={tmdbType}
        genreId={genreInfo.id}
      />
    </div>
  );
}
