"use client";

import { PLATFORMS } from "@/features/media/constants/platforms";
import {
  MOVIE_GENRE_IDS,
  TMDB_GENRES,
  TV_GENRE_IDS,
} from "@/features/media/constants/tmdb";
import { type MediaType } from "@/shared/types/common";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";
import { ChevronDown, X } from "lucide-react";
import React from "react";

interface MediaFilterFieldsProps {
  mediaType: MediaType | "all";
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
  filter?: string;
  isBollywood?: boolean;
}

export const MediaFilterFields: React.FC<MediaFilterFieldsProps> = ({
  mediaType,
  selectedGenres,
  setSelectedGenres,
  selectedYear,
  setSelectedYear,
  selectedPlatform,
  setSelectedPlatform,
  selectedSort,
  setSelectedSort,
  filter,
}) => {
  const genreIds = mediaType === "all"
    ? Array.from(new Set([...MOVIE_GENRE_IDS, ...TV_GENRE_IDS]))
    : (mediaType === "movie" ? MOVIE_GENRE_IDS : TV_GENRE_IDS);
  const genres = genreIds
    .map((id) => ({ id, name: TMDB_GENRES[id] }))
    .filter((g) => g.name);
  const years = Array.from({ length: 17 }, (_, i) => (2026 - i).toString());

  const defaultSort = filter === "trending" ? "trending" : "popularity.desc";

  const handleToggleGenre = (genreId: string) => {
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter((id) => id !== genreId));
    } else {
      setSelectedGenres([...selectedGenres, genreId]);
    }
  };

  const getGenresLabel = (values: string[]) => {
    if (values.length === 0) return "All Genres";
    if (values.length === 1) {
      return TMDB_GENRES[Number(values[0])] || values[0];
    }
    return `${values.length} Genres selected`;
  };

  const getYearLabel = (value: string) => {
    return value === "all" ? "All Years" : value;
  };

  const getPlatformLabel = (value: string) => {
    if (value === "all") return "All Platforms";
    const platform = PLATFORMS.find((p) => p.id === value);
    return platform ? platform.name : value;
  };

  const getSortLabel = (value: string) => {
    if (value === "popularity.desc") return "Popularity";
    if (value === "vote_average.desc") return "Top Rated";
    if (value === "trending") return "Trending Now";
    if (
      value === "primary_release_date.desc" ||
      value === "first_air_date.desc"
    )
      return "Release Date";
    return value;
  };

  return (
    <>
      {/* Genre select (Multi-Select Dropdown) */}
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-[10px] font-black uppercase tracking-widest text-white/20 font-sans">
          Genres
        </label>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "flex h-10 w-full items-center justify-between gap-2 rounded-lg border bg-black/60 py-2 pr-2.5 pl-3 text-sm whitespace-nowrap shadow-lg transition-all duration-300 ease-out outline-hidden cursor-pointer hover:border-blue-500/40 hover:bg-zinc-900/40 hover:shadow-[0_0_15px_rgba(59,130,246,0.12)] text-left focus-visible:border-blue-500/80 focus-visible:ring-4 focus-visible:ring-blue-500/15",
              selectedGenres.length > 0
                ? "border-blue-500/50 bg-blue-950/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                : "border-white/10 text-white",
            )}
          >
            <span className="truncate">{getGenresLabel(selectedGenres)}</span>
            <ChevronDown className="size-4 shrink-0 text-white/40" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-[300px] w-(--radix-dropdown-menu-trigger-width) min-w-[200px] overflow-y-auto bg-zinc-950 border border-white/10 text-white rounded-lg p-1.5 shadow-2xl">
            {genres.map((g) => (
              <DropdownMenuCheckboxItem
                key={g.id}
                checked={selectedGenres.includes(g.id.toString())}
                onCheckedChange={() => handleToggleGenre(g.id.toString())}
                closeOnClick={false}
                className="cursor-pointer py-2 pr-8 pl-3 text-sm rounded-lg hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white"
              >
                {g.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {selectedGenres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
            {selectedGenres.map((genreId) => {
              const name = TMDB_GENRES[Number(genreId)] || genreId;
              return (
                <span
                  key={genreId}
                  className="inline-flex items-center gap-1 pl-2 pr-1.5 py-0.5 rounded-md text-[11px] font-medium bg-blue-500/10 border border-blue-500/20 text-blue-400"
                >
                  {name}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleGenre(genreId);
                    }}
                    className="p-0.5 rounded-sm hover:bg-blue-500/20 text-blue-400/70 hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Release Year select */}
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-[10px] font-black uppercase tracking-widest text-white/20 font-sans">
          Release Year
        </label>
        <Select
          value={selectedYear}
          onValueChange={(val) => setSelectedYear(val || "all")}
        >
          <SelectTrigger
            className={cn(
              "w-full transition-all duration-300",
              selectedYear !== "all" &&
                "border-blue-500/50 bg-blue-950/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]",
            )}
          >
            <SelectValue placeholder="All Years">
              {getYearLabel(selectedYear)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Streaming Platform select */}
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-[10px] font-black uppercase tracking-widest text-white/20 font-sans">
          Platform
        </label>
        <Select
          value={selectedPlatform}
          onValueChange={(val) => setSelectedPlatform(val || "all")}
        >
          <SelectTrigger
            className={cn(
              "w-full transition-all duration-300",
              selectedPlatform !== "all" &&
                "border-blue-500/50 bg-blue-950/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]",
            )}
          >
            <SelectValue placeholder="All Platforms">
              {getPlatformLabel(selectedPlatform)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            {PLATFORMS.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort By select */}
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-[10px] font-black uppercase tracking-widest text-white/20 font-sans">
          Sort By
        </label>
        <Select
          value={selectedSort}
          onValueChange={(val) => setSelectedSort(val || "popularity.desc")}
        >
          <SelectTrigger
            className={cn(
              "w-full transition-all duration-300",
              selectedSort !== defaultSort &&
                "border-blue-500/50 bg-blue-950/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]",
            )}
          >
            <SelectValue placeholder="Sort By">
              {getSortLabel(selectedSort)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity.desc">Popularity</SelectItem>
            <SelectItem value="vote_average.desc">Top Rated</SelectItem>
            {filter === "trending" && (
              <SelectItem value="trending">Trending Now</SelectItem>
            )}
            <SelectItem
              value={
                mediaType === "movie"
                  ? "primary_release_date.desc"
                  : mediaType === "tv"
                    ? "first_air_date.desc"
                    : "primary_release_date.desc"
              }
            >
              Release Date
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default MediaFilterFields;
