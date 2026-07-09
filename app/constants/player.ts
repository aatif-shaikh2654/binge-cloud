import { Globe, type LucideIcon } from "lucide-react";

/**
 * Video Player Server Constants
 */

export interface PlayerServer {
  name: string;
  id: string;
  movieUrl: (tmdbId: string, startAt?: number, imdbId?: string) => string;
  tvUrl: (
    tmdbId: string,
    season: number,
    episode: number,
    startAt?: number,
    imdbId?: string,
  ) => string;
  trackingType?: "vidnest" | "vidsrc" | "vidfast";
  description?: string;
  icon?: LucideIcon;
}

export const PLAYER_SERVERS: PlayerServer[] = [
  {
    name: "Server 1",
    id: "server-1",
    movieUrl: (tmdbId: string) =>
      `https://www.vidsrc.wtf/2/movie/${tmdbId}?color=2563eb`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://www.vidsrc.wtf/2/tv/${tmdbId}/${season}/${episode}?color=2563eb`,
    description: "Multi-Language",
    icon: Globe,
    trackingType: "vidsrc",
  },
  {
    name: "Server 2",
    id: "server-2",
    movieUrl: (tmdbId: string, startAt?: number) =>
      `https://vidfast.pro/movie/${tmdbId}?theme=2563eb${startAt ? `&startAt=${startAt}` : ""}`,
    tvUrl: (
      tmdbId: string,
      season: number,
      episode: number,
      startAt?: number,
    ) =>
      `https://vidfast.pro/tv/${tmdbId}/${season}/${episode}?theme=2563eb${startAt ? `&startAt=${startAt}` : ""}`,
    trackingType: "vidfast",
  },

  {
    name: "Server 3",
    id: "server-3",
    movieUrl: (tmdbId: string) =>
      `https://play.xpass.top/e/movie/${tmdbId}?autostart=false`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://play.xpass.top/e/tv/${tmdbId}/${season}/${episode}?autostart=false`,
  },
  {
    name: "Server 4",
    id: "server-5",
    movieUrl: (tmdbId: string) =>
      `https://player.vidzee.wtf/embed/movie/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://player.vidzee.wtf/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    name: "Server 5",
    id: "server-6",
    movieUrl: (tmdbId: string) => `https://player.videasy.net/movie/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://player.videasy.net/tv/${tmdbId}/${season}/${episode}`,
  },

  {
    name: "Server 6",
    id: "server-7",
    movieUrl: (tmdbId: string) => `https://vidlink.pro/movie/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    name: "Server 7",
    id: "server-8",
    movieUrl: (tmdbId: string, startAt?: number) =>
      `https://vidnest.fun/movie/${tmdbId}${startAt ? `?startAt=${startAt}` : ""}`,
    tvUrl: (
      tmdbId: string,
      season: number,
      episode: number,
      startAt?: number,
    ) =>
      `https://vidnest.fun/tv/${tmdbId}/${season}/${episode}${startAt ? `?progress=${startAt}` : ""}`,
    trackingType: "vidnest",
  },
  {
    name: "Server 8",
    id: "server-9",
    movieUrl: (tmdbId: string) =>
      `https://streams.iqsmartgames.com/embed/movie/${tmdbId}?key=e11a7debaaa4f5d25b671706ffe4d2acb56efbd4`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://streams.iqsmartgames.com/embed/tv/${tmdbId}/${season}/${episode}?key=e11a7debaaa4f5d25b671706ffe4d2acb56efbd4`,
    description: "Multi-Language",
    icon: Globe,
  },
  {
    name: "Server 9",
    id: "server-10",
    movieUrl: (tmdbId: string, startAt?: number, imdbId?: string) => {
      const id = imdbId || tmdbId;
      const type = imdbId ? "imdb" : "tmdb";
      return `https://cineverse.modiplay.xyz/embed/${type}/movie?id=${id}`;
    },
    tvUrl: (
      tmdbId: string,
      season: number,
      episode: number,
      startAt?: number,
      imdbId?: string,
    ) => {
      const id = imdbId || tmdbId;
      const type = imdbId ? "imdb" : "tmdb";
      return `https://cineverse.modiplay.xyz/embed/${type}/tv?id=${id}&season=${season}&episode=${episode}`;
    },
    icon: Globe,
  },
];
