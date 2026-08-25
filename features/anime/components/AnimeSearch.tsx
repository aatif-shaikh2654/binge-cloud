"use client";

import { useDebounce } from "@/app/hooks/useDebounce";
import { searchAnime } from "@/app/services/anilist.service";
import { cn } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import AnimeCard from "./AnimeCard";
import AnimeSearchCard from "./AnimeSearchCard";

const AnimeSearch = () => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  const closeSearch = useCallback(() => {
    setIsExpanded(false);
    setQuery("");
    setSelectedIndex(-1);
  }, []);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["anime-search", debouncedQuery],
      queryFn: ({ pageParam = 1 }) =>
        searchAnime(debouncedQuery, pageParam, 12),
      getNextPageParam: (lastPage) =>
        lastPage.pageInfo.hasNextPage
          ? lastPage.pageInfo.currentPage + 1
          : undefined,
      enabled: debouncedQuery.length > 2 && isExpanded,
      initialPageParam: 1,
    });

  const results = data?.pages.flatMap((page) => page.media) ?? [];

  const scrollToIndex = (index: number) => {
    if (index >= 0 && scrollContainerRef.current) {
      const selectedElement = scrollContainerRef.current.querySelector(
        `[data-index="${index}"]`,
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }

      // Load more if we're near the end of current results
      if (index >= results.length - 4 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "s") {
        event.preventDefault();
        if (isExpanded) {
          closeSearch();
        } else {
          setIsExpanded(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }
        return;
      }

      if (!isExpanded) return;

      if (event.key === "Escape") {
        closeSearch();
        inputRef.current?.blur();
      }
    };

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (!isExpanded) return;
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeSearch();
      }
    };

    if (isExpanded) {
      document.body.style.overflow = "hidden";
    }

    document.addEventListener("keydown", handleGlobalKeyDown);
    document.addEventListener("mousedown", handleOutsideClick, {
      capture: true,
    });
    document.addEventListener("touchstart", handleOutsideClick, {
      capture: true,
    });

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
      document.removeEventListener("mousedown", handleOutsideClick, {
        capture: true,
      });
      document.removeEventListener("touchstart", handleOutsideClick, {
        capture: true,
      });
      document.body.style.overflow = "auto";
    };
  }, [isExpanded, closeSearch]);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = Math.min(selectedIndex + 1, results.length - 1);
      setSelectedIndex(nextIndex);
      scrollToIndex(nextIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const nextIndex = Math.max(selectedIndex - 1, -1);
      setSelectedIndex(nextIndex);
      scrollToIndex(nextIndex);
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && results[selectedIndex]) {
        router.push(`/anime/detail?id=${results[selectedIndex].id}`);
        closeSearch();
      }
    }
  };

  return (
    <>
      {isExpanded && (
        <div
          className="fixed inset-0 z-180 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-500"
          onClick={closeSearch}
        />
      )}
      <div className="absolute top-6 right-4 sm:right-8 z-200">
        <div className="relative z-300" ref={containerRef}>
          <div
            className={cn(
              "flex items-center bg-black/60 backdrop-blur-xl border transition-all duration-500 ease-in-out overflow-hidden",
              isExpanded
                ? "w-[calc(100vw-32px)] sm:w-[450px] lg:w-[500px] border-blue-500 ring-2 ring-blue-500 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.4)]"
                : "w-[44px] h-[44px] border-white/10 hover:border-white/20 rounded-full",
            )}
          >
            <button
              onClick={() => {
                if (isExpanded) {
                  closeSearch();
                } else {
                  setIsExpanded(true);
                  setTimeout(() => inputRef.current?.focus(), 0);
                }
              }}
              className={cn(
                "shrink-0 w-[44px] h-[44px] flex items-center justify-center transition-all duration-500 rounded-full",
                !isExpanded ? "bg-blue-600 text-white" : "text-blue-500",
              )}
            >
              <Search
                className={cn(
                  "w-5 h-5 transition-transform duration-500",
                  isExpanded && "scale-90",
                )}
              />
            </button>

            <div
              className={cn(
                "flex-1 flex items-center pr-4 transition-all duration-500",
                isExpanded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4 pointer-events-none",
              )}
            >
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleQueryChange}
                onKeyDown={handleKeyDown}
                placeholder="Search anime..."
                className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm text-white placeholder:text-white/20 px-3 py-2.5 font-bold"
              />

              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                  }}
                  className="p-1 text-white/20 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Results Dropdown */}
          {debouncedQuery.length > 2 && isExpanded && (
            <div className="absolute top-full right-0 mt-3 w-[calc(100vw-32px)] sm:w-[550px] lg:w-[650px] bg-zinc-950/98 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
              <div
                ref={scrollContainerRef}
                className="p-3 sm:p-4 max-h-[550px] overflow-y-auto custom-scrollbar"
              >
                {isLoading && results.length === 0 ? (
                  <div className="space-y-6">
                    {/* Desktop Skeleton */}
                    <div className="hidden sm:grid sm:grid-cols-4 gap-3 lg:gap-4">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="aspect-2/3 bg-white/5 rounded-xl animate-pulse"
                        />
                      ))}
                    </div>
                    {/* Mobile Skeleton */}
                    <div className="flex flex-col gap-2 sm:hidden">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 animate-pulse"
                        >
                          <div className="w-20 h-24 bg-white/10 rounded-xl" />
                          <div className="flex-1 space-y-3">
                            <div className="h-4 bg-white/10 rounded-md w-3/4" />
                            <div className="h-3 bg-white/10 rounded-md w-1/2" />
                            <div className="h-3 bg-white/10 rounded-md w-1/4 mt-auto" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-6">
                    {/* Desktop Grid Layout */}
                    <div className="hidden sm:grid sm:grid-cols-4 gap-3 lg:gap-4">
                      {results.map((anime, index) => (
                        <div
                          key={anime.id}
                          data-index={index}
                          className={cn(
                            "transition-all duration-300 rounded-xl overflow-hidden",
                            selectedIndex === index
                              ? "scale-[1.05] ring-2 ring-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                              : "hover:scale-[1.03]",
                          )}
                          onClick={closeSearch}
                        >
                          <AnimeCard anime={anime} disableHoverCard={true} />
                        </div>
                      ))}
                    </div>

                    {/* Mobile List Layout */}
                    <div className="flex flex-col gap-2 sm:hidden">
                      {results.map((anime, index) => (
                        <div
                          key={anime.id}
                          data-index={index}
                          className={cn(
                            "transition-all duration-300 rounded-2xl",
                            selectedIndex === index
                              ? "ring-2 ring-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)] bg-blue-500/5"
                              : "",
                          )}
                          onClick={closeSearch}
                        >
                          <AnimeSearchCard anime={anime} />
                        </div>
                      ))}
                    </div>

                    <div
                      ref={observerRef}
                      className="py-8 flex flex-col items-center justify-center gap-3"
                    >
                      {hasNextPage ? (
                        <>
                          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                          <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
                            Syncing more...
                          </span>
                        </>
                      ) : (
                        <div className="flex items-center gap-4 w-full">
                          <div className="h-px bg-white/5 flex-1" />
                          <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.3em]">
                            End of Collection
                          </span>
                          <div className="h-px bg-white/5 flex-1" />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  !isLoading && (
                    <div className="py-24 text-center">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-white/10" />
                      </div>
                      <p className="text-sm font-black text-white/30 uppercase tracking-widest">
                        No anime found
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AnimeSearch;
