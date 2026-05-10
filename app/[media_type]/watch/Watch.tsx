"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PLAYER_SERVERS, type PlayerServer } from "@/app/constants/player";
import ServerSwitcher from "../_components/ServerSwitcher";
import { type TMDBSeason } from "@/app/types/tmdb";
import EpisodeSwitcher from "../_components/EpisodeSwitcher";

interface WatchProps {
  id: string;
  tmdbType: "movie" | "tv";
  seasons?: TMDBSeason[];
}

const Watch: React.FC<WatchProps> = ({ id, tmdbType, seasons }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Single Source of Truth: Get current server, season, and episode from URL
  const serverId = searchParams.get("server");
  const currentServer =
    PLAYER_SERVERS.find((s) => s.id === serverId) || PLAYER_SERVERS[0];

  const season = Number(searchParams.get("season")) || 1;
  const episode = Number(searchParams.get("episode")) || 1;

  const handleServerChange = (server: PlayerServer) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("server", server.id);
    router.replace(`${window.location.pathname}?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleEpisodeChange = (s: number, e: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("season", s.toString());
    newParams.set("episode", e.toString());
    router.replace(`${window.location.pathname}?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handleBack = () => {
    router.back();
  };

  const videoUrl =
    tmdbType === "tv"
      ? currentServer.tvUrl(id, season, episode)
      : currentServer.movieUrl(id);

  return (
    <div className="fixed inset-0 z-1000 bg-background">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 z-50 p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/20 transition-all group"
      >
        <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
      </button>

      {/* Server Switcher */}
      <div className="absolute top-6 flex flex-col items-end gap-2 right-6 z-50">
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

      {/* Video Player Iframe - Background layer */}
      <div className="absolute inset-0 z-0">
        <iframe
          src={videoUrl}
          className="w-full h-full border-none"
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture"
          title="BingeCloud Video Player"
        />
      </div>
    </div>
  );
};

export default Watch;
