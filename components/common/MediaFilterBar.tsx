"use client";

import { TMDB_GENRES } from "@/app/constants/tmdb";
import { type MediaType } from "@/app/types/common";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import React from "react";

interface MediaFilterBarProps {
  mediaType: MediaType;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedScore: string;
  setSelectedScore: (score: string) => void;
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
  filter?: string;
}

const MOVIE_GENRE_IDS = [
  28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 10770,
  53, 10752, 37,
];
const TV_GENRE_IDS = [
  10759, 16, 35, 80, 99, 18, 10751, 10762, 9648, 10763, 10764, 10765, 10766,
  10767, 10768, 37,
];

export const MediaFilterBar: React.FC<MediaFilterBarProps> = ({
  mediaType,
  selectedGenre,
  setSelectedGenre,
  selectedYear,
  setSelectedYear,
  selectedScore,
  setSelectedScore,
  selectedSort,
  setSelectedSort,
  filter,
}) => {
  const genreIds = mediaType === "movie" ? MOVIE_GENRE_IDS : TV_GENRE_IDS;
  const genres = genreIds
    .map((id) => ({ id, name: TMDB_GENRES[id] }))
    .filter((g) => g.name);
  const years = Array.from({ length: 17 }, (_, i) => (2026 - i).toString());

  const defaultSort = filter === "trending" ? "trending" : "popularity.desc";

  const hasActiveFilters =
    selectedGenre !== "all" ||
    selectedYear !== "all" ||
    selectedScore !== "all" ||
    selectedSort !== defaultSort;

  const handleClear = () => {
    setSelectedGenre("all");
    setSelectedYear("all");
    setSelectedScore("all");
    setSelectedSort(defaultSort);
  };

  // Label Map Helpers for Shadcn Select trigger value display
  const getGenreLabel = (value: string) => {
    if (value === "all") return "All Genres";
    return TMDB_GENRES[Number(value)] || value;
  };

  const getYearLabel = (value: string) => {
    return value === "all" ? "All Years" : value;
  };

  const getScoreLabel = (value: string) => {
    if (value === "all") return "All Scores";
    if (value === "8") return "8+ (Excellent)";
    if (value === "7") return "7+ (Good)";
    if (value === "6") return "6+ (Fair)";
    return value;
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
    <div className="flex flex-col gap-4 w-full bg-card/25 backdrop-blur-md rounded-xl border border-white/5 shadow-2xl">
      {/* Header section with Clear Button */}
      <div className="flex justify-between items-center px-0.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 font-sans">
          Filters
        </span>
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <X className="w-3 h-3" />
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Genre select */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/20 font-sans">
            Genre
          </label>
          <Select
            value={selectedGenre}
            onValueChange={(val) => setSelectedGenre(val || "all")}
          >
            <SelectTrigger
              className={cn(
                "w-full transition-all duration-300",
                selectedGenre !== "all" &&
                  "border-blue-500/50 bg-blue-950/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]",
              )}
            >
              <SelectValue placeholder="All Genres">
                {getGenreLabel(selectedGenre)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map((g) => (
                <SelectItem key={g.id} value={g.id.toString()}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

        {/* User Score select */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/20 font-sans">
            User Score
          </label>
          <Select
            value={selectedScore}
            onValueChange={(val) => setSelectedScore(val || "all")}
          >
            <SelectTrigger
              className={cn(
                "w-full transition-all duration-300",
                selectedScore !== "all" &&
                  "border-blue-500/50 bg-blue-950/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]",
              )}
            >
              <SelectValue placeholder="All Scores">
                {getScoreLabel(selectedScore)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scores</SelectItem>
              <SelectItem value="8">8+ (Excellent)</SelectItem>
              <SelectItem value="7">7+ (Good)</SelectItem>
              <SelectItem value="6">6+ (Fair)</SelectItem>
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
                    : "first_air_date.desc"
                }
              >
                Release Date
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
