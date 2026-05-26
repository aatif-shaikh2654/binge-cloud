import { type TMDBPerson } from "@/app/types/tmdb";
import React from "react";

interface PersonalInfoProps {
  person: TMDBPerson;
  age: number | null;
  formatDate: (dateStr: string | null) => string;
}

export default function PersonalInfo({ person, age, formatDate }: PersonalInfoProps) {
  return (
    <div className="border-t border-white/10 pt-8 space-y-4">
      <h2 className="text-xl font-extrabold tracking-tight">Personal Info</h2>
      <div className="flex flex-wrap gap-x-12 gap-y-6 pt-2">
        {/* Known For */}
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-blue-500">
            Known For
          </span>
          <p className="text-base font-extrabold text-white/95 leading-none">
            {person.known_for_department || "Acting"}
          </p>
        </div>

        {/* Born */}
        {person.birthday && (
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-500">
              Born
            </span>
            <p className="text-base font-extrabold text-white/95 leading-none">
              {formatDate(person.birthday)}
              {age && !person.deathday && ` (Age ${age})`}
            </p>
          </div>
        )}

        {/* Birth Place */}
        {person.place_of_birth && (
          <div className="space-y-1 max-w-full sm:max-w-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-500">
              Birth Place
            </span>
            <p className="text-base font-extrabold text-white/95 leading-snug break-words">
              {person.place_of_birth}
            </p>
          </div>
        )}

        {/* Popularity */}
        {person.popularity !== undefined && (
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-500">
              Popularity
            </span>
            <p className="text-base font-extrabold text-white/95 leading-none">
              {person.popularity.toFixed(1)}
            </p>
          </div>
        )}

        {/* Died */}
        {person.deathday && (
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-red-500">
              Died
            </span>
            <p className="text-base font-extrabold text-white/95 leading-none">
              {formatDate(person.deathday)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
