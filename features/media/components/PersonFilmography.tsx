"use client";

import { type TMDBPersonCredits } from "@/features/media/types/tmdb";
import MovieCard from "@/features/media/components/MovieCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Film, Loader2, Tv } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface PersonFilmographyProps {
  credits?: TMDBPersonCredits;
  isLoading?: boolean;
}

export default function PersonFilmography({ credits, isLoading }: PersonFilmographyProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [visibleCount, setVisibleCount] = useState(20);
  const itemsPerLoad = 20;

  // Filter and sort cast credits
  const movieCredits = useMemo(() => {
    return (credits?.cast || [])
      .filter(
        (item) =>
          item.media_type === "movie" &&
          (item.poster_path || item.backdrop_path),
      )
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }, [credits?.cast]);

  const tvCredits = useMemo(() => {
    return (credits?.cast || [])
      .filter(
        (item) =>
          item.media_type === "tv" && (item.poster_path || item.backdrop_path),
      )
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }, [credits?.cast]);

  const allCredits = useMemo(() => {
    return (credits?.cast || [])
      .filter((item) => item.poster_path || item.backdrop_path)
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }, [credits?.cast]);

  // Paginated slices
  const movieCreditsPaginated = useMemo(() => {
    if (activeTab !== "movies") return [];
    return movieCredits.slice(0, visibleCount);
  }, [movieCredits, visibleCount, activeTab]);

  const tvCreditsPaginated = useMemo(() => {
    if (activeTab !== "tv") return [];
    return tvCredits.slice(0, visibleCount);
  }, [tvCredits, visibleCount, activeTab]);

  const allCreditsPaginated = useMemo(() => {
    if (activeTab !== "all") return [];
    return allCredits.slice(0, visibleCount);
  }, [allCredits, visibleCount, activeTab]);

  const totalItems = useMemo(() => {
    if (activeTab === "all") return allCredits.length;
    if (activeTab === "movies") return movieCredits.length;
    return tvCredits.length;
  }, [activeTab, allCredits.length, movieCredits.length, tvCredits.length]);

  const hasMore = visibleCount < totalItems;

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleCount((prev) => prev + itemsPerLoad);
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    );

    const target = observerTarget.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [activeTab, hasMore]);

  if (isLoading) {
    return (
      <div className="space-y-8 border-t border-white/5 pt-12 animate-pulse">
        <div className="space-y-1">
          <Skeleton className="h-4 w-24 bg-white/5" />
          <Skeleton className="h-10 w-64 bg-white/5" />
        </div>
        <div className="h-[50px] w-64 rounded-md bg-white/5" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="aspect-2/3 w-full rounded-xl bg-white/5" />
              <div className="flex flex-col gap-1.5 px-1">
                <Skeleton className="h-4 w-3/4 bg-white/5 animate-pulse" />
                <Skeleton className="h-3 w-1/2 bg-white/5 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 border-t border-white/5 pt-12">
      <div className="space-y-1">
        <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-blue-500">
          Filmography
        </h3>
        <h2 className="text-2xl md:text-5xl font-black tracking-tighter">
          Credits & Works
        </h2>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={(val) => {
          setActiveTab(val);
          setVisibleCount(20);
        }}
        className="w-full"
      >
        <TabsList className="bg-white/2 border border-white/10 rounded-md mb-8 p-1 w-full sm:w-fit flex items-center! justify-start! gap-1.5 h-[50px]! overflow-x-auto flex-nowrap select-none">
          <TabsTrigger
            value="all"
            className="font-black text-[10px]! md:text-xs uppercase tracking-wider px-5 h-full rounded-[8px] transition-all duration-300 text-white/50 hover:text-white/80 hover:bg-white/2 data-active:bg-blue-600! data-active:text-white! data-active:shadow-[0_3px_10px_rgba(37,99,235,0.3)]! cursor-pointer flex items-center justify-center shrink-0"
          >
            All ({allCredits.length})
          </TabsTrigger>
          <TabsTrigger
            value="movies"
            className="font-black text-[10px]! md:text-xs uppercase tracking-wider px-5 h-full rounded-[8px] transition-all duration-300 text-white/50 hover:text-white/80 hover:bg-white/2 data-active:bg-blue-600! data-active:text-white! data-active:shadow-[0_3px_10px_rgba(37,99,235,0.3)]! flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Film className="w-3.5 h-3.5" /> Movies ({movieCredits.length})
          </TabsTrigger>
          <TabsTrigger
            value="tv"
            className="font-black text-[10px]! md:text-xs uppercase tracking-wider px-5 h-full rounded-[8px] transition-all duration-300 text-white/50 hover:text-white/80 hover:bg-white/2 data-active:bg-blue-600! data-active:text-white! data-active:shadow-[0_3px_10px_rgba(37,99,235,0.3)]! flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Tv className="w-3.5 h-3.5" /> TV Shows ({tvCredits.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="all"
          className="outline-none animate-in fade-in duration-500"
        >
          {allCreditsPaginated.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {allCreditsPaginated.map((item) => (
                <MovieCard
                  key={`${item.id}-${item.media_type}`}
                  movie={item}
                  mediaType={item.media_type}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/5 border border-dashed border-white/10 rounded-2xl">
              <p className="text-white/40 font-medium">
                No acting credits found.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="movies"
          className="outline-none animate-in fade-in duration-500"
        >
          {movieCreditsPaginated.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movieCreditsPaginated.map((item) => (
                <MovieCard
                  key={`${item.id}-movie`}
                  movie={item}
                  mediaType="movie"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/5 border border-dashed border-white/10 rounded-2xl">
              <p className="text-white/40 font-medium">
                No movies found in credits.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="tv"
          className="outline-none animate-in fade-in duration-500"
        >
          {tvCreditsPaginated.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {tvCreditsPaginated.map((item) => (
                <MovieCard key={`${item.id}-tv`} movie={item} mediaType="tv" />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/5 border border-dashed border-white/10 rounded-2xl">
              <p className="text-white/40 font-medium">
                No TV shows found in credits.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Observer Target for Infinite Scroll */}
      {hasMore && (
        <div
          ref={observerTarget}
          className="h-20 flex items-center justify-center mt-12 animate-in fade-in duration-500"
        >
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      )}
    </div>
  );
}
