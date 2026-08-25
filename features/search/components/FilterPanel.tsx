"use client";

import React from "react";
import { FilterX } from "lucide-react";
import { TMDB_GENRES } from "@/features/media/constants/tmdb";
import { cn } from "@/shared/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { type SearchFilters } from "./Search";

interface FilterPanelProps {
  filters: SearchFilters;
  updateFilter: <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K],
  ) => void;
  toggleGenre: (id: number) => void;
  clearFilters: () => void;
  totalResults: number;
  resultsCount: number;
  contentTypes: { id: string; label: string }[];
  sortOptions: { id: string; label: string }[];
  ratingPresets: { id: string; label: string; min: number }[];
  years: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  updateFilter,
  toggleGenre,
  clearFilters,
  totalResults,
  resultsCount,
  contentTypes,
  sortOptions,
  ratingPresets,
  years,
}) => {
  const {
    contentType,
    selectedGenres,
    fromYear,
    toYear,
    minRating,
    sortBy,
    ratingPreset,
  } = filters;

  return (
    <div className="bg-card border border-white/5 rounded-xl p-6 space-y-8">
      {/* Content Type */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30">
          Content Type
        </h4>
        <div className="flex gap-2">
          {contentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() =>
                updateFilter(
                  "contentType",
                  type.id as SearchFilters["contentType"],
                )
              }
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-bold transition-all",
                contentType === type.id
                  ? "bg-blue-600 text-white"
                  : "bg-muted text-white/40 hover:text-white",
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Genres */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30">
          Genre
        </h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilter("selectedGenres", [])}
            className={cn(
              "px-4 py-1.5 rounded-full text-[10px] font-bold transition-all",
              selectedGenres.length === 0
                ? "bg-blue-600 text-white"
                : "bg-muted text-white/40 hover:text-white",
            )}
          >
            All Genres
          </button>
          {Object.entries(TMDB_GENRES).map(([id, label]) => (
            <button
              key={id}
              onClick={() => toggleGenre(parseInt(id))}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-bold transition-all",
                selectedGenres.includes(parseInt(id))
                  ? "bg-white/10 text-blue-400 border border-blue-500/30"
                  : "bg-muted text-white/40 hover:text-white",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* From Year */}
        <div className="space-y-2 relative">
          <div className="absolute -top-2 left-3 px-1 bg-card z-10 text-[9px] font-bold uppercase tracking-widest text-white/30">
            From Year
          </div>
          <Select
            value={fromYear}
            onValueChange={(val) => updateFilter("fromYear", val as string)}
          >
            <SelectTrigger className="w-full bg-transparent border-white/10 text-white/80 h-10 text-[11px] font-bold">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-white/10">
              <SelectItem value="Any">Any</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* To Year */}
        <div className="space-y-2 relative">
          <div className="absolute -top-2 left-3 px-1 bg-card z-10 text-[9px] font-bold uppercase tracking-widest text-white/30">
            To Year
          </div>
          <Select
            value={toYear}
            onValueChange={(val) => updateFilter("toYear", val as string)}
          >
            <SelectTrigger className="w-full bg-transparent border-white/10 text-white/80 h-10 text-[11px] font-bold">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-white/10">
              <SelectItem value="Any">Any</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Min Rating */}
        <div className="space-y-2 relative">
          <div className="absolute -top-2 left-3 px-1 bg-card z-10 text-[9px] font-bold uppercase tracking-widest text-white/30">
            Min Rating
          </div>
          <Select
            value={minRating}
            onValueChange={(val) => updateFilter("minRating", val as string)}
          >
            <SelectTrigger className="w-full bg-transparent border-white/10 text-white/80 h-10 text-[11px] font-bold">
              <SelectValue placeholder="Any Rating" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-white/10">
              <SelectItem value="Any Rating">Any Rating</SelectItem>
              {["5", "6", "7", "8", "9"].map((rating) => (
                <SelectItem key={rating} value={rating}>
                  {rating}+
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="space-y-2 relative">
          <div className="absolute -top-2 left-3 px-1 bg-card z-10 text-[9px] font-bold uppercase tracking-widest text-white/30">
            Sort By
          </div>
          <Select
            value={sortBy}
            onValueChange={(val) => updateFilter("sortBy", val as string)}
          >
            <SelectTrigger className="w-full bg-transparent border-white/10 text-white/80 h-10 text-[11px] font-bold">
              <SelectValue placeholder="Most Popular" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-white/10">
              {sortOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Rating Preset */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30">
          Rating Preset
        </h4>
        <div className="flex flex-wrap gap-2">
          {ratingPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                updateFilter("ratingPreset", preset.id);
                updateFilter(
                  "minRating",
                  preset.min === 0 ? "Any Rating" : preset.min.toString(),
                );
              }}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-bold transition-all",
                ratingPreset === preset.id
                  ? "bg-blue-600 text-white"
                  : "bg-muted text-white/40 hover:text-white",
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <p className="text-[10px] font-medium text-white/20">
          {selectedGenres.length === 0 &&
          fromYear === "Any" &&
          toYear === "Any" &&
          minRating === "Any Rating"
            ? "No filters active — showing trending"
            : `${resultsCount > 0 ? totalResults.toLocaleString() : "0"} results matching your criteria`}
        </p>
        <button
          onClick={clearFilters}
          className="text-[9px] font-bold uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1.5"
        >
          <FilterX className="w-3 h-3" />
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
