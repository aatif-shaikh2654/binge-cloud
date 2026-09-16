"use client";

import { PLAYER_SERVERS, type PlayerServer } from "@/features/player/constants/player";
import { useWatchNavigation } from "@/features/player/hooks/useWatchNavigation";
import { type MediaType } from "@/shared/types/common";
import { type TMDBMovie, type TMDBSeason } from "@/features/media/types/tmdb";
import { ArrowLeft } from "lucide-react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React from "react";
import EpisodeSwitcher from "./EpisodeSwitcher";
import Player from "@/features/player/components/Player";
import ServerSwitcher from "@/features/player/components/ServerSwitcher";

interface WatchProps {
  id: string;
  tmdbType: MediaType;
  seasons?: TMDBSeason[];
  details: TMDBMovie;
}

const Watch: React.FC<WatchProps> = ({ id, tmdbType, seasons, details }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const mediaType = params.media_type as string;

  // Single Source of Truth: Get current server, season, and episode from URL
  const serverId = searchParams.get("server");
  const currentServer =
    PLAYER_SERVERS.find((s) => s.id === serverId) || PLAYER_SERVERS[0];

  const seasonParam = searchParams.get("season");
  const season = seasonParam !== null ? Number(seasonParam) : 1;
  const episodeParam = searchParams.get("episode");
  const episode = episodeParam !== null ? Number(episodeParam) : 1;

  const handleServerChange = (server: PlayerServer) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("server", server.id);
    router.replace(`${pathname}?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleEpisodeChange = (s: number, e: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("season", s.toString());
    newParams.set("episode", e.toString());
    router.replace(`${pathname}?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const { handleBack: navigateBack } = useWatchNavigation();

  const handleBack = () => {
    navigateBack(`/${mediaType}/detail?id=${id}`);
  };

  return (
    <div className="fixed inset-0 z-1000 bg-background">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 z-100 p-3 bg-zinc-900 border border-white/10 rounded-full text-white hover:bg-zinc-800 transition-all group shadow-2xl"
      >
        <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
      </button>

      {/* Server Switcher */}
      <div className="absolute top-6 flex flex-col items-end gap-2 right-6 z-100">
        <div className="flex items-center gap-3">
          {tmdbType === "tv" && seasons && (
            <EpisodeSwitcher
              tvId={Number(id)}
              seasons={seasons}
              currentSeason={season}
              currentEpisode={episode}
              onEpisodeChange={handleEpisodeChange}
            />
          )}
          <ServerSwitcher
            currentServer={currentServer}
            onServerChange={handleServerChange}
          />
        </div>
      </div>

      <Player
        id={id}
        tmdbType={tmdbType}
        currentServer={currentServer}
        season={season}
        episode={episode}
        details={details}
        seasons={seasons}
        onEpisodeChange={handleEpisodeChange}
      />
    </div>
  );
};

export default Watch;
