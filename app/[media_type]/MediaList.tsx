"use client";

import {
  discoverMedia,
  getSimilarMedia,
  getTrendingMedia,
} from "@/app/services/all.service";
import { useFilterStore } from "@/app/store/useFilterStore";
import { type MediaType } from "@/app/types/common";
import { type TMDBMovie, type TMDBResponse } from "@/app/types/tmdb";
import FilterBarContainer from "@/components/common/FilterBarContainer";
import MediaFilterFields from "@/components/common/MediaFilterFields";
import MovieCard from "@/components/common/MovieCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { useCallback, useRef } from "react";

interface MediaListProps {
  initialData: TMDBResponse<TMDBMovie>;
  mediaType: MediaType;
  relatedTo?: string | number;
  filter?: string;
  genreId?: number;
  platformId?: string;
}

const MediaList: React.FC<MediaListProps> = ({
  initialData,
  mediaType,
  relatedTo,
  filter,
  genreId,
  platformId,
}) => {
  const {
    selectedGenres,
    setSelectedGenres,
    selectedYear,
    setSelectedYear,
    selectedSort,
    setSelectedSort,
    selectedPlatform,
    setSelectedPlatform,
    resetTmdbFilters,
  } = useFilterStore();

  const prevGenreIdRef = React.useRef<number | undefined | null>(null);
  const prevPlatformIdRef = React.useRef<string | undefined | null>(null);

  // Synchronize dynamic routing query param props into the store
  React.useEffect(() => {
    if (genreId !== prevGenreIdRef.current) {
      if (genreId) {
        setSelectedGenres([genreId.toString()]);
      } else {
        setSelectedGenres([]);
      }
      prevGenreIdRef.current = genreId;
    }
  }, [genreId, setSelectedGenres]);

  React.useEffect(() => {
    if (platformId !== prevPlatformIdRef.current) {
      if (platformId) {
        setSelectedPlatform(platformId);
      } else {
        setSelectedPlatform("all");
      }
      prevPlatformIdRef.current = platformId;
    }
  }, [platformId, setSelectedPlatform]);

  React.useEffect(() => {
    if (filter === "trending") {
      setSelectedSort("trending");
    } else if (selectedSort === "trending") {
      setSelectedSort("popularity.desc");
    }
  }, [filter, setSelectedSort, selectedSort]);

  const defaultSort = filter === "trending" ? "trending" : "popularity.desc";

  const hasActiveFilters =
    selectedGenres.length > 0 ||
    selectedYear !== "all" ||
    selectedPlatform !== "all" ||
    selectedSort !== defaultSort;

  const isDefault =
    (genreId
      ? selectedGenres.length === 1 && selectedGenres[0] === genreId.toString()
      : selectedGenres.length === 0) &&
    selectedYear === "all" &&
    selectedSort === defaultSort &&
    selectedPlatform === (platformId || "all");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [
        "media-list",
        mediaType,
        relatedTo,
        filter,
        genreId,
        selectedGenres,
        selectedYear,
        selectedSort,
        selectedPlatform,
      ],
      queryFn: async ({ pageParam = 1 }) => {
        if (relatedTo) {
          return getSimilarMedia(relatedTo, mediaType, pageParam);
        } else if (selectedSort === "trending" && isDefault) {
          return getTrendingMedia(
            mediaType as "movie" | "tv",
            "week",
            pageParam,
          );
        } else {
          const params: Parameters<typeof discoverMedia>[1] = {
            page: pageParam,
          };

          // Commas represent AND operator in TMDB discover genres parameter
          if (selectedGenres.length > 0) {
            params.with_genres = selectedGenres.join(",");
          }

          if (selectedYear !== "all") {
            if (mediaType === "movie")
              params.primary_release_year = selectedYear;
            else params.first_air_date_year = selectedYear;
          }

          if (selectedPlatform !== "all") {
            params.with_watch_providers = selectedPlatform;
            params.watch_region = "US";
            params.with_watch_monetization_types = "flatrate";
          }

          if (selectedSort === "trending") {
            params.sort_by = "popularity.desc";
          } else {
            params.sort_by = selectedSort;
          }

          return discoverMedia(mediaType, params);
        }
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.page < lastPage.total_pages) {
          return lastPage.page + 1;
        }
        return undefined;
      },
      getPreviousPageParam: (firstPage) => {
        if (firstPage.page > 1) {
          return firstPage.page - 1;
        }
        return undefined;
      },
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      // Load initial data on mount without fetching
      initialData: () => {
        if (initialData && isDefault) {
          return {
            pages: [initialData],
            pageParams: [1],
          };
        }
        return undefined;
      },
    });

  const items = data?.pages.flatMap((page) => page.results || []) || [];

  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        {
          rootMargin: "400px",
        },
      );

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  return (
    <div className="px-6 lg:px-20 flex flex-col gap-10">
      {/* Hide filters on recommendation pages */}
      {!relatedTo && (
        <FilterBarContainer
          hasActiveFilters={hasActiveFilters}
          onClear={resetTmdbFilters}
        >
          <MediaFilterFields
            mediaType={mediaType}
            selectedGenres={selectedGenres}
            setSelectedGenres={setSelectedGenres}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedPlatform={selectedPlatform}
            setSelectedPlatform={setSelectedPlatform}
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            filter={filter}
          />
        </FilterBarContainer>
      )}

      {/* Grid List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 md:gap-x-6 md:gap-y-10 gap-x-4 gap-y-6">
        {items.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            ref={index === items.length - 1 ? lastItemRef : null}
            className="animate-in fade-in zoom-in-95 duration-500"
            style={{
              animationDelay: `${(index % 20) * 50}ms`,
              animationFillMode: "backwards",
            }}
          >
            <MovieCard movie={item} mediaType={mediaType} />
          </div>
        ))}
      </div>

      {(isLoading || isFetchingNextPage) && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-white/20 font-bold uppercase tracking-widest text-[9px]">
            Loading more titles...
          </p>
        </div>
      )}

      {!hasNextPage && items.length > 0 && !isLoading && (
        <div className="flex flex-col items-center gap-4 py-20 opacity-20">
          <div className="h-px w-20 bg-white" />
          <p className="text-[9px] font-bold uppercase tracking-widest">
            End of results
          </p>
        </div>
      )}
    </div>
  );
};

export default MediaList;
