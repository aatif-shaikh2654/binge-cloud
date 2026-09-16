"use client";

import { useDebounce } from "@/shared/hooks/useDebounce";
import {
  discoverMedia,
  getTrendingMovies,
  searchMedia,
} from "@/features/media/services/all.service";
import { type MediaType } from "@/shared/types/common";
import { TMDBMovie } from "@/features/media/types/tmdb";
import MovieCard from "@/features/media/components/MovieCard";
import PageHeader from "@/shared/components/layout/PageHeader";
import { cn } from "@/shared/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Loader2,
  Search as SearchIcon,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import FilterPanel from "./FilterPanel";

const CONTENT_TYPES = [
  { id: "all", label: "All" },
  { id: "movie", label: "Movies" },
  { id: "tv", label: "TV Shows" },
] as const;

const SORT_OPTIONS = [
  { id: "popularity.desc", label: "Most Popular" },
  { id: "vote_average.desc", label: "Top Rated" },
  { id: "primary_release_date.desc", label: "Latest" },
  { id: "revenue.desc", label: "Box Office" },
];

const RATING_PRESETS = [
  { id: "any", label: "Any Rating", min: 0 },
  { id: "6", label: "6+ Good", min: 6 },
  { id: "7", label: "7+ Great", min: 7 },
  { id: "8", label: "8+ Excellent", min: 8 },
  { id: "9", label: "9+ Masterpiece", min: 9 },
];

const YEARS = Array.from({ length: 126 }, (_, i) => (2025 - i).toString());

export interface SearchFilters {
  contentType: "all" | MediaType;
  selectedGenres: number[];
  fromYear: string;
  toYear: string;
  minRating: string;
  sortBy: string;
  ratingPreset: string;
}

const INITIAL_FILTERS: SearchFilters = {
  contentType: "all",
  selectedGenres: [],
  fromYear: "Any",
  toYear: "Any",
  minRating: "Any Rating",
  sortBy: "popularity.desc",
  ratingPreset: "any",
};

const Search = () => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>(INITIAL_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedQuery = useDebounce(query, 500);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["search", debouncedQuery, filters],
      queryFn: async ({ pageParam = 1 }) => {
        if (debouncedQuery.trim()) {
          const response = await searchMedia(debouncedQuery, pageParam);
          return {
            ...response,
            results: response.results.filter(
              (item: TMDBMovie) =>
                (item.media_type === "movie" || item.media_type === "tv") &&
                item.poster_path,
            ),
          };
        } else {
          // Discovery mode
          const params: Record<string, string | number> = {
            page: pageParam,
            sort_by: filters.sortBy,
          };

          if (filters.selectedGenres.length > 0) {
            params.with_genres = filters.selectedGenres.join(",");
          }

          if (filters.fromYear !== "Any") {
            params["primary_release_date.gte"] = `${filters.fromYear}-01-01`;
            params["first_air_date.gte"] = `${filters.fromYear}-01-01`;
          }

          if (filters.toYear !== "Any") {
            params["primary_release_date.lte"] = `${filters.toYear}-12-31`;
            params["first_air_date.lte"] = `${filters.toYear}-12-31`;
          }

          if (filters.minRating !== "Any Rating") {
            params["vote_average.gte"] = parseFloat(filters.minRating);
          }

          if (filters.contentType === "all") {
            if (
              filters.selectedGenres.length === 0 &&
              filters.fromYear === "Any" &&
              filters.toYear === "Any" &&
              filters.minRating === "Any Rating"
            ) {
              return getTrendingMovies(pageParam);
            } else {
              return discoverMedia("movie", params);
            }
          } else {
            return discoverMedia(filters.contentType, params);
          }
        }
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleGenre = (genreId: number) => {
    setFilters((prev) => ({
      ...prev,
      selectedGenres: prev.selectedGenres.includes(genreId)
        ? prev.selectedGenres.filter((id) => id !== genreId)
        : [...prev.selectedGenres, genreId],
    }));
  };

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const results = data?.pages.flatMap((page) => page.results) || [];
  const totalResults = data?.pages[0]?.total_results || 0;

  return (
    <div className="min-h-screen bg-background pt-8 pb-20 px-0 text-white">
      <div className="mx-auto mb-8">
        <PageHeader
          title="Search"
          description="Find your favorite movies and series across our entire library."
          className="mb-6"
        />

        <div className="flex gap-3 items-center px-4 lg:px-20">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <SearchIcon className="w-4 h-4 text-white/60 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, TV shows, genres..."
              className="w-full bg-card/50 border font-bold border-white/20 text-white pl-12 pr-12 py-3 rounded-lg text-sm placeholder:text-white/40 focus:outline-none focus:border-blue-600 shadow-xl transition-all"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute inset-y-0 right-4 flex items-center text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "h-12 px-6 rounded-lg transition-all duration-300 flex items-center gap-2 font-bold text-xs",
              showFilters
                ? "bg-blue-600 text-white shadow-[0_0_25px_rgba(37,99,235,0.4)]"
                : "bg-card/50 border border-white/20 text-white/60 hover:text-white hover:bg-card/80",
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>

        <div
          className={cn(
            "mt-4 overflow-hidden transition-all duration-500 ease-in-out px-4 lg:px-20",
            showFilters
              ? "max-h-[1000px] opacity-100 mb-10"
              : "max-h-0 opacity-0",
          )}
        >
          <FilterPanel
            filters={filters}
            updateFilter={updateFilter}
            toggleGenre={toggleGenre}
            clearFilters={clearFilters}
            totalResults={totalResults}
            resultsCount={results.length}
            contentTypes={[...CONTENT_TYPES]}
            sortOptions={SORT_OPTIONS}
            ratingPresets={RATING_PRESETS}
            years={YEARS}
          />
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 lg:px-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-white/20 font-bold uppercase tracking-widest text-[9px]">
              Scanning database...
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-center animate-in fade-in zoom-in-95 duration-700">
            <SearchIcon className="w-12 h-12 text-white/5 mb-6" />
            <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">
              No Matches
            </h2>
            <p className="text-white/40 max-w-xs text-xs font-medium leading-relaxed">
              Try adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white">
                    {debouncedQuery
                      ? `Results for "${debouncedQuery}"`
                      : "Discover"}
                  </h3>
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-0.5">
                    {totalResults.toLocaleString()} titles found
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 md:gap-x-6 md:gap-y-10 gap-x-3 gap-y-6">
              {results.map((item, idx) => (
                <div
                  key={`${item.media_type}-${item.id}-${idx}`}
                  className="animate-in fade-in slide-in-from-bottom-5 duration-500"
                  style={{
                    animationDelay: `${(idx % 20) * 20}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  <MovieCard movie={item} />
                </div>
              ))}
            </div>

            <div ref={scrollRef} className="py-20 flex justify-center">
              {isFetchingNextPage ? (
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              ) : hasNextPage ? (
                <div className="h-10 w-full" />
              ) : (
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/10">
                  End of results
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
