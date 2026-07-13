"use client";

import { getFilteredAnime } from "@/app/services/anilist.service";
import { useFilterStore } from "@/app/store/useFilterStore";
import {
  AnimeCategory,
  type AniListPageResponse,
  type AniListSort,
} from "@/app/types/anilist";
import AnimeCard from "@/components/common/AnimeCard";
import AnimeFilterFields from "@/components/common/AnimeFilterFields";
import FilterBarContainer from "@/components/common/FilterBarContainer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { useCallback, useRef } from "react";

interface AnimeListProps {
  initialData: AniListPageResponse;
  category?: AnimeCategory;
  genre?: string;
}

const AnimeList: React.FC<AnimeListProps> = ({
  initialData,
  category,
  genre,
}) => {
  // Default Sort based on category
  const defaultSort =
    category === "trending"
      ? "TRENDING_DESC"
      : category === "top-rated"
        ? "SCORE_DESC"
        : "POPULARITY_DESC";

  const {
    animeSelectedGenres: selectedGenres,
    setAnimeSelectedGenres: setSelectedGenres,
    animeSelectedYear: selectedYear,
    setAnimeSelectedYear: setSelectedYear,
    animeSelectedFormat: selectedFormat,
    setAnimeSelectedFormat: setSelectedFormat,
    animeSelectedSort: selectedSort,
    setAnimeSelectedSort: setSelectedSort,
    resetAnimeFilters,
  } = useFilterStore();

  const prevGenreRef = React.useRef<string | undefined | null>(null);
  const prevCategoryRef = React.useRef<AnimeCategory | undefined | null>(null);

  // Synchronize dynamic routing parameters into the store
  React.useEffect(() => {
    if (genre !== prevGenreRef.current || category !== prevCategoryRef.current) {
      if (genre) {
        setSelectedGenres([genre]);
        setSelectedSort("POPULARITY_DESC");
        setSelectedFormat("all");
        setSelectedYear("all");
      } else if (category) {
        setSelectedSort(defaultSort);
        if (category === "movies") {
          setSelectedFormat("MOVIE");
        } else {
          setSelectedFormat("all");
        }
        setSelectedGenres([]);
        setSelectedYear("all");
      } else {
        setSelectedGenres([]);
        setSelectedSort(defaultSort);
        setSelectedFormat("all");
        setSelectedYear("all");
      }
      prevGenreRef.current = genre;
      prevCategoryRef.current = category;
    }
  }, [genre, category, defaultSort, setSelectedGenres, setSelectedSort, setSelectedFormat, setSelectedYear]);

  const defaultFormat = category === "movies" ? "MOVIE" : "all";

  const hasActiveFilters =
    selectedGenres.length > 0 ||
    selectedYear !== "all" ||
    selectedFormat !== defaultFormat ||
    selectedSort !== defaultSort;

  const isDefault =
    (genre
      ? selectedGenres.length === 1 && selectedGenres[0] === genre
      : selectedGenres.length === 0) &&
    selectedYear === "all" &&
    selectedFormat === defaultFormat &&
    selectedSort === defaultSort;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [
        "anime-list",
        category,
        genre,
        selectedGenres,
        selectedYear,
        selectedFormat,
        selectedSort,
      ],
      queryFn: async ({ pageParam = 1 }) => {
        // Construct query options
        const queryOptions: Parameters<typeof getFilteredAnime>[0] = {
          page: pageParam,
          sort: [selectedSort as AniListSort],
        };

        if (selectedGenres.length > 0) {
          queryOptions.genre_in = selectedGenres;
        }

        if (selectedYear !== "all")
          queryOptions.seasonYear = Number(selectedYear);
        if (selectedFormat !== "all") queryOptions.format = selectedFormat;
        if (category === "movies" && selectedFormat === "all") {
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
      getPreviousPageParam: (firstPage) => {
        if (firstPage.pageInfo.currentPage > 1) {
          return firstPage.pageInfo.currentPage - 1;
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
      <FilterBarContainer
        hasActiveFilters={hasActiveFilters}
        onClear={resetAnimeFilters}
      >
        <AnimeFilterFields
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedFormat={selectedFormat}
          setSelectedFormat={setSelectedFormat}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          defaultSort={defaultSort}
          defaultFormat={defaultFormat}
        />
      </FilterBarContainer>

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
