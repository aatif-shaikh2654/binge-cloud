"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import MovieCard from "@/components/common/MovieCard";
import { type TMDBMovie, type TMDBResponse } from "@/app/types/tmdb";
import { getMediaList } from "@/app/services/all.service";
import { Loader2 } from "lucide-react";

interface MediaListProps {
  initialData: TMDBResponse<TMDBMovie>;
  mediaType: "movie" | "tv";
}

const MediaList: React.FC<MediaListProps> = ({ initialData, mediaType }) => {
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
          rootMargin: "400px", // Trigger earlier for smoother experience
        },
      );

      if (node) observerRef.current.observe(node);
    },
    [isLoading, hasMore],
  );

  // Load more data when page changes
  useEffect(() => {
    if (page === 1) return;

    const loadMore = async () => {
      setIsLoading(true);
      try {
        const newData = await getMediaList(mediaType, "popular", page);
        setItems((prev) => {
          // Filter out potential duplicates just in case
          const newItems = newData.results || [];
          const existingIds = new Set(prev.map((i) => i.id));
          const filteredNewItems = newItems.filter(
            (i) => !existingIds.has(i.id),
          );
          return [...prev, ...filteredNewItems];
        });
        setHasMore(page < newData.total_pages);
      } catch (error) {
        console.error("Error loading more media:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMore();
  }, [page, mediaType]);

  console.log(items);

  console.log(mediaType);
  return (
    <div className="px-8 lg:px-24 flex flex-col gap-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-x-6 gap-y-10">
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

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-white/20 font-bold uppercase tracking-widest text-[9px]">
            Loading more titles...
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

export default MediaList;
