"use client";

import { getTrendingMovies } from "@/app/services/all.service";
import { type TMDBMovie, type TMDBResponse } from "@/app/types/tmdb";
import MovieCard from "@/components/common/MovieCard";
import { Loader2 } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface TrendingListProps {
  initialData: TMDBResponse<TMDBMovie>;
}

const TrendingList: React.FC<TrendingListProps> = ({ initialData }) => {
  const [items, setItems] = useState<TMDBMovie[]>(initialData.results || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(page < initialData.total_pages);
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
        const newData = await getTrendingMovies(page);
        setItems((prev) => {
          const newItems = newData.results || [];
          const existingIds = new Set(prev.map((i) => i.id));
          const filteredNewItems = newItems.filter(
            (i) => !existingIds.has(i.id),
          );
          return [...prev, ...filteredNewItems];
        });
        setHasMore(page < newData.total_pages);
      } catch (error) {
        console.error("Error loading more trending:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMore();
  }, [page]);

  return (
    <div className="px-6 lg:px-20 flex flex-col gap-10">
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
            <MovieCard movie={item} />
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <div className="text-center py-20">
          <div className="h-px w-full bg-white/5 mb-8" />
          <p className="text-white/20 font-black uppercase tracking-[0.2em] text-xs">
            End of trending content
          </p>
        </div>
      )}
    </div>
  );
};

export default TrendingList;
