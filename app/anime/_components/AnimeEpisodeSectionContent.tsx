"use client";

import {
  type AniListNextAiringEpisode,
  type AniListStreamingEpisode,
} from "@/app/types/anilist";
import { useWatchNavigation } from "@/app/hooks/useWatchNavigation";
import { useHistoryStore } from "@/app/store/useHistoryStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface AnimeEpisodeSectionContentProps {
  animeId: number;
  totalEpisodes: number | null;
  streamingEpisodes: AniListStreamingEpisode[];
  nextAiringEpisode: AniListNextAiringEpisode | null;
}

const CHUNK_SIZE = 100;

export function parseEpisodeNumber(title: string | null): number | null {
  if (!title) return null;
  const match = title.match(/Episode\s+(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

export function buildEpisodeMap(
  streamingEpisodes: AniListStreamingEpisode[],
): Map<number, AniListStreamingEpisode> {
  const map = new Map<number, AniListStreamingEpisode>();
  for (const ep of streamingEpisodes) {
    const num = parseEpisodeNumber(ep.title);
    if (num !== null && !map.has(num)) {
      map.set(num, ep);
    }
  }
  return map;
}

export function resolveEpisodeCount(
  totalEpisodes: number | null,
  nextAiringEpisode: AniListNextAiringEpisode | null,
  streamingEpisodesLength: number,
): number {
  return (
    (nextAiringEpisode ? nextAiringEpisode.episode - 1 : null) ??
    totalEpisodes ??
    streamingEpisodesLength
  );
}

const AnimeEpisodeSectionContent: React.FC<AnimeEpisodeSectionContentProps> = ({
  animeId,
  totalEpisodes,
  streamingEpisodes,
  nextAiringEpisode,
}) => {
  const { handleWatchClick } = useWatchNavigation();
  const { history } = useHistoryStore();

  const historyItem = history.find(
    (h) => h.id === animeId && h.media_type === "anime",
  );

  const totalCount = resolveEpisodeCount(
    totalEpisodes,
    nextAiringEpisode,
    streamingEpisodes.length,
  );

  const initialChunk = historyItem?.episode
    ? Math.floor((Number(historyItem.episode) - 1) / CHUNK_SIZE)
    : 0;
  const [activeChunk, setActiveChunk] = useState(initialChunk);

  if (totalCount === 0) return null;

  const episodeMap = buildEpisodeMap(streamingEpisodes);
  const chunkCount = Math.ceil(totalCount / CHUNK_SIZE);

  const chunkStart = activeChunk * CHUNK_SIZE + 1;
  const chunkEnd = Math.min(chunkStart + CHUNK_SIZE - 1, totalCount);
  const episodes = Array.from(
    { length: chunkEnd - chunkStart + 1 },
    (_, i) => chunkStart + i,
  );

  return (
    <section className="ps-8! lg:ps-24! md:py-6 pb-6 relative z-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pe-8! lg:pe-24! border-b border-white/5 pb-4 md:pb-6 mb-8 gap-4">
        <div className="space-y-1 md:space-y-2">
          <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-blue-500">
            All Episodes
          </h3>
          <h2 className="text-2xl md:text-5xl font-black tracking-tighter">
            Episodes
            {totalCount > 0 && (
              <span className="ml-3 text-base md:text-2xl font-black text-white/30">
                {totalCount}
              </span>
            )}
          </h2>
        </div>

        {chunkCount > 1 && (
          <Select
            value={String(activeChunk)}
            onValueChange={(v) => setActiveChunk(Number(v))}
          >
            <SelectTrigger className="w-[160px] bg-zinc-900 border-white/10 text-white font-black uppercase tracking-[0.15em] text-[10px] h-10 rounded-full px-5 hover:bg-zinc-800 transition-all shadow-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              className="bg-zinc-950 border-white/10 shadow-2xl rounded-xl p-1"
              side="bottom"
              align="end"
            >
              {Array.from({ length: chunkCount }, (_, i) => {
                const start = i * CHUNK_SIZE + 1;
                const end = Math.min(start + CHUNK_SIZE - 1, totalCount);
                return (
                  <SelectItem
                    key={i}
                    value={String(i)}
                    className="text-[10px] font-black uppercase tracking-widest data-[highlighted]:bg-white data-[highlighted]:text-black! data-[highlighted]:**:text-black! py-3 px-6 transition-all duration-300 rounded-lg cursor-pointer"
                  >
                    {start}–{end}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Episode grid */}
      <div className="pe-8! lg:pe-24! grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {episodes.map((epNum) => {
          const epData = episodeMap.get(epNum);
          const rawTitle = epData?.title ?? null;
          const cleanTitle = rawTitle
            ? rawTitle.replace(/^Episode\s+\d+\s*[-–—]\s*/i, "").trim() || null
            : null;

          const isCurrentlyWatching = historyItem?.episode === epNum;

          return (
            <Link
              key={epNum}
              href={`/anime/watch?id=${animeId}&ep=${epNum}`}
              onClick={handleWatchClick}
              className={cn(
                "group flex flex-col gap-2 p-3.5 rounded-lg border transition-all duration-300 active:scale-95",
                isCurrentlyWatching
                  ? "bg-blue-600/80 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)] backdrop-blur-sm"
                  : "bg-black border-white/5 hover:bg-zinc-900 hover:border-blue-500/30",
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest transition-colors",
                    isCurrentlyWatching
                      ? "text-white"
                      : "text-white/40 group-hover:text-blue-400",
                  )}
                >
                  EP {epNum}
                </span>
                <Play
                  className={cn(
                    "w-3 h-3 transition-all fill-current",
                    isCurrentlyWatching
                      ? "text-white opacity-100"
                      : "text-white/20 group-hover:text-blue-400 opacity-0 group-hover:opacity-100",
                  )}
                />
              </div>
              {cleanTitle ? (
                <p className="text-xs font-bold text-white/80 line-clamp-2 leading-tight group-hover:text-white transition-colors">
                  {cleanTitle}
                </p>
              ) : (
                <p className="text-sm font-black text-white/60 group-hover:text-white transition-colors">
                  Episode {epNum}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default AnimeEpisodeSectionContent;
