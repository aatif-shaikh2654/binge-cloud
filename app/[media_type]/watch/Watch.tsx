"use client";

import { PLAYER_SERVERS, type PlayerServer } from "@/app/constants/player";
import { type TMDBMovie, type TMDBSeason } from "@/app/types/tmdb";
import { type MediaType } from "@/app/types/common";
import { useHistoryStore } from "@/lib/store/useHistoryStore";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import EpisodeSwitcher from "../_components/EpisodeSwitcher";
import ServerSwitcher from "../_components/ServerSwitcher";

interface WatchProps {
  id: string;
  tmdbType: MediaType;
  seasons?: TMDBSeason[];
  details: TMDBMovie;
}

const Watch: React.FC<WatchProps> = ({ id, tmdbType, seasons, details }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const mediaType = params.media_type as string;
  const addToHistory = useHistoryStore((state) => state.addToHistory);

  // Single Source of Truth: Get current server, season, and episode from URL
  const serverId = searchParams.get("server");
  const currentServer =
    PLAYER_SERVERS.find((s) => s.id === serverId) || PLAYER_SERVERS[0];

  const season = Number(searchParams.get("season")) || 1;
  const episode = Number(searchParams.get("episode")) || 1;

  // Add to history effect
  useEffect(() => {
    if (!details) return;

    addToHistory({
      id: Number(id),
      media_type: tmdbType,
      title: details.title || details.name || "Unknown",
      poster_path: details.poster_path,
      backdrop_path: details.backdrop_path,
      server: currentServer.id,
      season: tmdbType === "tv" ? season : undefined,
      episode: tmdbType === "tv" ? episode : undefined,
      watchedAt: Date.now(),
    });
  }, [id, tmdbType, details, currentServer.id, season, episode, addToHistory]);

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
    router.push(`/${mediaType}/detail?id=${id}`);
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
        className="absolute top-6 left-6 z-100 p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/20 transition-all group"
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

      {/* Video Player Iframe - Background layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <iframe
          src={videoUrl}
          className="w-full h-full border-none pointer-events-auto"
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture"
          title="BingeCloud Video Player"
        />
      </div>
    </div>
  );
};

export default Watch;
