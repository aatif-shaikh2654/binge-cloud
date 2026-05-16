"use client";

import {
  getPopularAnime,
  getTopRatedAnime,
  getTrendingAnime,
} from "@/app/services/anilist.service";
import {
  AnimeCategory,
  type AniListMedia,
  type AniListPageResponse,
} from "@/app/types/anilist";
import AnimeCard from "@/components/common/AnimeCard";
import { Loader2 } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface AnimeListProps {
  initialData: AniListPageResponse;
  category: AnimeCategory;
}

const AnimeList: React.FC<AnimeListProps> = ({ initialData, category }) => {
  const [items, setItems] = useState<AniListMedia[]>(initialData.media || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialData.pageInfo.hasNextPage);
  const [isLoading, setIsLoading] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prevPage) => prevPage + 1);
          }
        },
        {
          rootMargin: "400px",
        },
      );

      if (node) observerRef.current.observe(node);
    },
    [isLoading, hasMore],
  );

  useEffect(() => {
    if (page === 1) return;

    const loadMore = async () => {
      setIsLoading(true);
      try {
        let newData: AniListPageResponse;
        switch (category) {
          case "trending":
            newData = await getTrendingAnime(page);
            break;
          case "popular":
            newData = await getPopularAnime(page);
            break;
          case "top-rated":
            newData = await getTopRatedAnime(page);
            break;
          default:
            newData = initialData;
        }

        setItems((prev) => {
          const newItems = newData.media || [];
          const existingIds = new Set(prev.map((i) => i.id));
          const filteredNewItems = newItems.filter(
            (i) => !existingIds.has(i.id),
          );
          return [...prev, ...filteredNewItems];
        });
        setHasMore(newData.pageInfo.hasNextPage);
      } catch (error) {
        console.error("Error loading more anime:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMore();
  }, [page, category, initialData]);

  return (
    <div className="px-6 lg:px-24 flex flex-col gap-10">
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

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-white/20 font-bold uppercase tracking-widest text-[9px]">
            Loading more anime...
          </p>
        </div>
      )}

      {!hasMore && items.length > 0 && (
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
