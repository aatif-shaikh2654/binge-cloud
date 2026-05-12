"use client";

import { FORMAT_LABEL, STATUS_LABEL } from "@/app/constants/anilist";
import { type AniListRelationEdge } from "@/app/types/anilist";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface AnimeRelationsProps {
  relations: AniListRelationEdge[];
}

const RELATION_LABEL: Record<string, string> = {
  SEQUEL: "Sequel",
  PREQUEL: "Prequel",
  ALTERNATIVE: "Alternative",
  SIDE_STORY: "Side Story",
  SUMMARY: "Summary",
  SOURCE: "Source",
  SPIN_OFF: "Spin-Off",
  ADAPTATION: "Adaptation",
  CHARACTER: "Character",
  OTHER: "Other",
};

const AnimeRelations: React.FC<AnimeRelationsProps> = ({ relations }) => {
  // Only show anime relations (skip manga source, etc.)
  const animeRelations = relations.filter((r) => r.node.type === "ANIME");
  if (animeRelations.length === 0) return null;

  return (
    <div className="space-y-8">
      <div className="border-b border-white/5 pb-4 md:pb-6">
        <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-blue-500 mb-1">
          More Like This
        </h3>
        <h2 className="text-2xl md:text-5xl font-black tracking-tighter">Related Anime</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {animeRelations.map(({ relationType, node }) => {
          const title = node.title.english || node.title.romaji || "Unknown";
          const cover = node.coverImage.extraLarge || node.coverImage.large;
          const format = node.format ? (FORMAT_LABEL[node.format] ?? node.format) : null;
          const status = node.status ? (STATUS_LABEL[node.status] ?? node.status) : null;
          const relation = RELATION_LABEL[relationType] ?? relationType;

          return (
            <Link
              key={node.id}
              href={`/anime/detail?id=${node.id}`}
              className="group flex flex-col gap-2"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-white/5 bg-white/5 transition-all duration-300 group-hover:border-white/20">
                {cover && (
                  <Image
                    src={cover}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
                <div className="absolute top-2 left-2">
                  <span className="bg-blue-600/80 backdrop-blur-sm text-white text-[9px] font-black px-2 py-0.5 rounded tracking-wider uppercase">
                    {relation}
                  </span>
                </div>
              </div>
              <div className="px-1 space-y-0.5">
                <p className="text-xs font-bold text-white line-clamp-2 leading-tight">{title}</p>
                <p className="text-[10px] font-medium text-white/40">
                  {[format, status].filter(Boolean).join(" · ")}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AnimeRelations;
