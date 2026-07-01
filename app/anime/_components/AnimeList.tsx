"use client";

import React, { useCallback, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getFilteredAnime } from "@/app/services/anilist.service";
import {
  AnimeCategory,
  type AniListMedia,
  type AniListPageResponse,
  type AniListSort,
} from "@/app/types/anilist";
import AnimeCard from "@/components/common/AnimeCard";
import { AnimeFilterBar } from "@/components/common/AnimeFilterBar";
import { Loader2 } from "lucide-react";

interface AnimeListProps {
  initialData: AniListPageResponse;
  category?: AnimeCategory;
  genre?: string;
}

const AnimeList: React.FC<AnimeListProps> = ({ initialData, category, genre }) => {
  // Default Sort based on category
  const defaultSort =
    category === "trending"
      ? "TRENDING_DESC"
      : category === "top-rated"
        ? "SCORE_DESC"
        : "POPULARITY_DESC";

  // Filter States
  const [selectedGenre, setSelectedGenre] = useState<string>(genre || "all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedFormat, setSelectedFormat] = useState<string>(category === "movies" ? "MOVIE" : "all");
  const [selectedSort, setSelectedSort] = useState<string>(defaultSort);

  const defaultFormat = category === "movies" ? "MOVIE" : "all";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: [
      "anime-list",
      category,
      genre,
      selectedGenre,
      selectedYear,
      selectedFormat,
      selectedSort,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      // Construct query options
      const queryOptions: any = {
        page: pageParam,
        sort: [selectedSort as AniListSort],
      };

      if (selectedGenre !== "all") queryOptions.genre_in = [selectedGenre];
      if (selectedYear !== "all") queryOptions.seasonYear = Number(selectedYear);
      if (selectedFormat !== "all") queryOptions.format = selectedFormat;
      if (category === "movies" && selectedFormat === "all") {
        // If we are on movies route, default to MOVIE format unless specified
        queryOptions.format = "MOVIE";
      }

      return getFilteredAnime(queryOptions);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pageInfo.hasNextPage) {
        return lastPage.pageInfo.currentPage + 1;
      }
      return undefined;
    },
    initialData: () => {
      const isDefault =
        selectedGenre === (genre || "all") &&
        selectedYear === "all" &&
        selectedFormat === defaultFormat &&
        selectedSort === defaultSort;

      if (isDefault) {
        return {
          pages: [initialData],
          pageParams: [1],
        };
      }
      return undefined;
    },
  });

  const items = data?.pages.flatMap((page) => page.media || []) || [];

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
      {/* Filter Bar */}
      <AnimeFilterBar
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedFormat={selectedFormat}
        setSelectedFormat={setSelectedFormat}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
        defaultSort={defaultSort}
        defaultFormat={defaultFormat}
      />

      {/* Grid list */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 md:gap-x-6 md:gap-y-10 gap-x-3 gap-y-6">
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
            <AnimeCard anime={item} />
          </div>
        ))}
      </div>

      {(isLoading || isFetchingNextPage) && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-white/20 font-bold uppercase tracking-widest text-[9px]">
            Loading more anime...
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

export default AnimeList;
