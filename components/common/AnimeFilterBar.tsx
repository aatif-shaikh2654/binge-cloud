"use client";

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

interface AnimeFilterBarProps {
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedFormat: string;
  setSelectedFormat: (format: string) => void;
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
  defaultSort?: string;
  defaultFormat?: string;
}

const ANILIST_GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Ecchi",
  "Fantasy",
  "Hentai",
  "Horror",
  "Mahou Shoujo",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
];

export const AnimeFilterBar: React.FC<AnimeFilterBarProps> = ({
  selectedGenre,
  setSelectedGenre,
  selectedYear,
  setSelectedYear,
  selectedFormat,
  setSelectedFormat,
  selectedSort,
  setSelectedSort,
  defaultSort = "POPULARITY_DESC",
  defaultFormat = "all",
}) => {
  const years = Array.from({ length: 17 }, (_, i) => (2026 - i).toString());

  const hasActiveFilters =
    selectedGenre !== "all" ||
    selectedYear !== "all" ||
    selectedFormat !== defaultFormat ||
    selectedSort !== defaultSort;

  const handleClear = () => {
    setSelectedGenre("all");
    setSelectedYear("all");
    setSelectedFormat(defaultFormat);
    setSelectedSort(defaultSort);
  };

  // Label Map Helpers for Shadcn Select trigger value display
  const getGenreLabel = (value: string) => {
    return value === "all" ? "All Genres" : value;
  };

  const getYearLabel = (value: string) => {
    return value === "all" ? "All Years" : value;
  };

  const getFormatLabel = (value: string) => {
    if (value === "all") return "All Formats";
    if (value === "TV") return "TV Shows";
    if (value === "MOVIE") return "Movies";
    if (value === "SPECIAL") return "Special";
    return value; // OVA, ONA, etc.
  };

  const getSortLabel = (value: string) => {
    if (value === "POPULARITY_DESC") return "Popularity";
    if (value === "SCORE_DESC") return "Top Rated";
    if (value === "TRENDING_DESC") return "Trending Now";
    if (value === "START_DATE_DESC") return "Release Date";
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
              {ANILIST_GENRES.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
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

        {/* Format select */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/20 font-sans">
            Format
          </label>
          <Select
            value={selectedFormat}
            onValueChange={(val) => setSelectedFormat(val || "all")}
          >
            <SelectTrigger
              className={cn(
                "w-full transition-all duration-300",
                selectedFormat !== defaultFormat &&
                  "border-blue-500/50 bg-blue-950/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]",
              )}
            >
              <SelectValue placeholder="All Formats">
                {getFormatLabel(selectedFormat)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Formats</SelectItem>
              <SelectItem value="TV">TV Shows</SelectItem>
              <SelectItem value="MOVIE">Movies</SelectItem>
              <SelectItem value="OVA">OVA</SelectItem>
              <SelectItem value="ONA">ONA</SelectItem>
              <SelectItem value="SPECIAL">Special</SelectItem>
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
            onValueChange={(val) => setSelectedSort(val || "POPULARITY_DESC")}
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
              <SelectItem value="POPULARITY_DESC">Popularity</SelectItem>
              <SelectItem value="SCORE_DESC">Top Rated</SelectItem>
              <SelectItem value="TRENDING_DESC">Trending Now</SelectItem>
              <SelectItem value="START_DATE_DESC">Release Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
