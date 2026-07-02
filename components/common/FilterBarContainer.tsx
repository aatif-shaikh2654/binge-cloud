"use client";

import { X } from "lucide-react";
import React from "react";

interface FilterBarContainerProps {
  hasActiveFilters: boolean;
  onClear: () => void;
  children: React.ReactNode;
}

export const FilterBarContainer: React.FC<FilterBarContainerProps> = ({
  hasActiveFilters,
  onClear,
  children,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full bg-card/25 backdrop-blur-md rounded-xl border border-white/5 shadow-2xl p-4">
      {/* Header section with Clear Button */}
      <div className="flex justify-between items-center px-0.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 font-sans">
          Filters
        </span>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <X className="w-3 h-3" />
            Clear Filters
          </button>
        )}
      </div>

      {/* Fields */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {children}
      </div>
    </div>
  );
};

export default FilterBarContainer;
