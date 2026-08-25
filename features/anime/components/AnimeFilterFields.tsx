"use client";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ChevronDown, X } from "lucide-react";
import React from "react";
import { ANILIST_GENRES } from "@/app/constants/anilist";

interface AnimeFilterFieldsProps {
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedFormat: string;
  setSelectedFormat: (format: string) => void;
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
  defaultSort?: string;
  defaultFormat?: string;
}


export const AnimeFilterFields: React.FC<AnimeFilterFieldsProps> = ({
  selectedGenres,
  setSelectedGenres,
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

  const handleToggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const getGenresLabel = (values: string[]) => {
    if (values.length === 0) return "All Genres";
    if (values.length === 1) return values[0];
    return `${values.length} Genres selected`;
  };

  const getYearLabel = (value: string) => {
    return value === "all" ? "All Years" : value;
  };

  const getFormatLabel = (value: string) => {
    if (value === "all") return "All Formats";
    if (value === "TV") return "TV Shows";
    if (value === "MOVIE") return "Movies";
    if (value === "SPECIAL") return "Special";
    return value;
  };

  const getSortLabel = (value: string) => {
    if (value === "POPULARITY_DESC") return "Popularity";
    if (value === "SCORE_DESC") return "Top Rated";
    if (value === "TRENDING_DESC") return "Trending Now";
    if (value === "START_DATE_DESC") return "Release Date";
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
            {ANILIST_GENRES.map((g) => (
              <DropdownMenuCheckboxItem
                key={g}
                checked={selectedGenres.includes(g)}
                onCheckedChange={() => handleToggleGenre(g)}
                closeOnClick={false}
                className="cursor-pointer py-2 pr-8 pl-3 text-sm rounded-lg hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white"
              >
                {g}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {selectedGenres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
            {selectedGenres.map((genre) => (
              <span
                key={genre}
                className="inline-flex items-center gap-1 pl-2 pr-1.5 py-0.5 rounded-md text-[11px] font-medium bg-blue-500/10 border border-blue-500/20 text-blue-400"
              >
                {genre}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleGenre(genre);
                  }}
                  className="p-0.5 rounded-sm hover:bg-blue-500/20 text-blue-400/70 hover:text-blue-300 transition-colors cursor-pointer"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
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
    </>
  );
};

export default AnimeFilterFields;
