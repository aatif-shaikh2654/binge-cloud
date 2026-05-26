"use client";

import { TMDB_IMAGE_BASE_URL } from "@/app/constants/tmdb";
import { type TMDBCast } from "@/app/types/tmdb";
import { Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CastCardProps {
  person: TMDBCast;
  index: number;
}

const CastCard: React.FC<CastCardProps> = ({ person, index }) => {
  return (
    <Link
      href={`/person/${person.id}`}
      className="group block space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-700 h-full cursor-pointer"
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90" />
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <p className="text-[10px] md:text-[11px] text-blue-400 font-black uppercase tracking-wider truncate drop-shadow-lg">
            {person.character}
          </p>
        </div>
      </div>
      <h4 className="text-sm font-black text-white group-hover:text-blue-500 transition-colors tracking-tight">
        {person.name}
      </h4>
    </Link>
  );
};

export default CastCard;
