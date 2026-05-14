"use client";

import { resolveEpisodeCount } from "@/app/anime/_components/AnimeEpisodeSectionContent";
import AnimeEpisodeSwitcher from "@/app/anime/_components/AnimeEpisodeSwitcher";
import AnimePlayer from "@/app/anime/_components/AnimePlayer";
import AnimeServerSwitcher from "@/app/anime/_components/AnimeServerSwitcher";
import { ANIME_SERVERS } from "@/app/constants/anime";
import { useWatchNavigation } from "@/app/hooks/useWatchNavigation";
import { type AniListMediaDetail } from "@/app/types/anilist";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback } from "react";

interface AnimeWatchProps {
  id: string;
  initialDetails: AniListMediaDetail;
}

const AnimeWatch: React.FC<AnimeWatchProps> = ({ id, initialDetails }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { handleBack } = useWatchNavigation();

  const ep = Math.max(1, Number(searchParams.get("ep")) || 1);
  const serverId = searchParams.get("server") || "megaplay-sub";

  const currentServer =
    ANIME_SERVERS.find((s) => s.id === serverId) || ANIME_SERVERS[0];

  const totalCount = resolveEpisodeCount(
    initialDetails.episodes,
    initialDetails.nextAiringEpisode,
    initialDetails.streamingEpisodes.length,
  );

  const navigate = useCallback(
    (newEp?: number, newServer?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newEp !== undefined) params.set("ep", newEp.toString());
      if (newServer !== undefined) params.set("server", newServer);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="fixed inset-0 z-[1000] bg-background">
      {/* Back */}
      <button
        onClick={() => handleBack(`/anime/detail?id=${id}`)}
        className="absolute top-6 left-6 z-[100] p-3 bg-zinc-900 border border-white/10 rounded-full text-white hover:bg-zinc-800 transition-all group shadow-2xl"
      >
        <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
      </button>

      {/* Controls — top right */}
      <div className="absolute top-6 right-6 z-[100] flex items-center gap-2">
        {/* Server switcher sheet */}
        <AnimeServerSwitcher
          currentServer={currentServer}
          onServerChange={(server) => navigate(undefined, server.id)}
        />

        {/* Episode switcher sheet */}
        <AnimeEpisodeSwitcher
          animeId={id}
          currentEp={ep}
          onEpisodeChange={(newEp) => navigate(newEp)}
          initialDetails={initialDetails}
        />
      </div>

      {/* Player Area */}
      <AnimePlayer
        id={id}
        ep={ep}
        currentServer={currentServer}
        totalCount={totalCount}
        navigate={navigate}
        initialDetails={initialDetails}
      />
    </div>
  );
};

export default AnimeWatch;
