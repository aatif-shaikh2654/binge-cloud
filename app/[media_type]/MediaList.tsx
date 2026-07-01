"use client";

import React, { useCallback, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getSimilarMedia, getTrendingMedia, discoverMedia } from "@/app/services/all.service";
import { type MediaType } from "@/app/types/common";
import { type TMDBMovie, type TMDBResponse } from "@/app/types/tmdb";
import MovieCard from "@/components/common/MovieCard";
import { MediaFilterBar } from "@/components/common/MediaFilterBar";
import { Loader2 } from "lucide-react";

interface MediaListProps {
  initialData: TMDBResponse<TMDBMovie>;
  mediaType: MediaType;
  relatedTo?: string | number;
  filter?: string;
  genreId?: number;
}

const MediaList: React.FC<MediaListProps> = ({
  initialData,
  mediaType,
  relatedTo,
  filter,
  genreId,
}) => {
  // Filter States
  const [selectedGenre, setSelectedGenre] = useState<string>(genreId ? genreId.toString() : "all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>(filter === "trending" ? "trending" : "popularity.desc");
  const [selectedScore, setSelectedScore] = useState<string>("all");

  const defaultSort = filter === "trending" ? "trending" : "popularity.desc";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: [
      "media-list",
      mediaType,
      relatedTo,
      filter,
      genreId,
      selectedGenre,
      selectedYear,
      selectedSort,
      selectedScore,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const isDefault =
        selectedGenre === (genreId ? genreId.toString() : "all") &&
        selectedYear === "all" &&
        selectedSort === defaultSort &&
        selectedScore === "all";

      if (relatedTo) {
        return getSimilarMedia(relatedTo, mediaType, pageParam);
      } else if (selectedSort === "trending" && isDefault) {
        return getTrendingMedia(mediaType as "movie" | "tv", "week", pageParam);
      } else {
        const params: any = { page: pageParam };
        if (selectedGenre !== "all") params.with_genres = selectedGenre;
        if (selectedYear !== "all") {
          if (mediaType === "movie") params.primary_release_year = selectedYear;
          else params.first_air_date_year = selectedYear;
        }
        if (selectedScore !== "all") params["vote_average.gte"] = Number(selectedScore);
        
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
    initialData: () => {
      const isDefault =
        selectedGenre === (genreId ? genreId.toString() : "all") &&
        selectedYear === "all" &&
        selectedSort === defaultSort &&
        selectedScore === "all";

      if (isDefault && !relatedTo) {
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
        <MediaFilterBar
          mediaType={mediaType}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedScore={selectedScore}
          setSelectedScore={setSelectedScore}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          filter={filter}
        />
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
