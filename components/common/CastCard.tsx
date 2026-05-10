"use client";

import React from "react";
import Image from "next/image";
import { Users } from "lucide-react";
import { type TMDBCast } from "@/app/types/tmdb";
import { TMDB_IMAGE_BASE_URL } from "@/app/constants/tmdb";

interface CastCardProps {
  person: TMDBCast;
  index: number;
}

const CastCard: React.FC<CastCardProps> = ({ person, index }) => {
  return (
    <div
      className="group space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-700 h-full"
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: "backwards",
      }}
    >
      <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-white/5 bg-white/5 transition-all duration-500 group-hover:border-white/20 group-hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]">
        {person.profile_path ? (
          <Image
            src={`${TMDB_IMAGE_BASE_URL}/w300${person.profile_path}`}
            alt={person.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0 grayscale-[0.3]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5">
            <Users className="w-10 h-10 text-white/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-[10px] text-blue-400 font-black uppercase tracking-tighter truncate leading-none mb-1">
            {person.character}
          </p>
        </div>
      </div>
      <h4 className="text-sm font-black text-white group-hover:text-blue-500 transition-colors uppercase tracking-tight">
        {person.name}
      </h4>
    </div>
  );
};

export default CastCard;
