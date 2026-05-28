import { Globe, type LucideIcon } from "lucide-react";

/**
 * Video Player Server Constants
 */

export interface PlayerServer {
  name: string;
  id: string;
  movieUrl: (tmdbId: string) => string;
  tvUrl: (tmdbId: string, season: number, episode: number) => string;
  description?: string;
  icon?: LucideIcon;
}

export const PLAYER_SERVERS: PlayerServer[] = [
  {
    name: "Server 1",
    id: "server-1",
    movieUrl: (tmdbId: string) => `https://vidnest.fun/movie/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://vidnest.fun/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    name: "Server 2",
    id: "server-2",
    movieUrl: (tmdbId: string) =>
      `https://play.xpass.top/e/movie/${tmdbId}?autostart=false`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://play.xpass.top/e/tv/${tmdbId}/${season}/${episode}?autostart=false`,
  },
  {
    name: "Server 3",
    id: "server-3",
    movieUrl: (tmdbId: string) =>
      `https://player.vidzee.wtf/embed/movie/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://player.vidzee.wtf/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    name: "Server 4",
    id: "server-4",
    movieUrl: (tmdbId: string) => `https://vidlink.pro/movie/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    name: "Server 5",
    id: "server-5",
    movieUrl: (tmdbId: string) => `https://player.videasy.net/movie/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://player.videasy.net/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    name: "Server 6",
    id: "server-6",
    movieUrl: (tmdbId: string) => `https://111movies.com/movie/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://111movies.com/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    name: "Server 7",
    id: "server-7",
    movieUrl: (tmdbId: string) =>
      `https://www.vidsrc.wtf/2/movie/${tmdbId}?color=2563eb`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://www.vidsrc.wtf/2/tv/${tmdbId}/${season}/${episode}?color=2563eb`,
    description: "Multi-Language",
    icon: Globe,
  },
  {
    name: "Server 8",
    id: "server-8",
    movieUrl: (tmdbId: string) =>
      `https://vidfast.pro/movie/${tmdbId}?theme=2563eb`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://vidfast.pro/tv/${tmdbId}/${season}/${episode}?theme=2563eb`,
  },
];
