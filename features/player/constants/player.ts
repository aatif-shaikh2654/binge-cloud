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
    title?: string,
  ) => string;
  trackingType?: "vidnest" | "vidsrc" | "vidfast" | "vidbolt";
  description?: string;
  icon?: LucideIcon;
}

export const PLAYER_SERVERS: PlayerServer[] = [
  {
    name: "Server 1",
    id: "server-1",
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
      title?: string,
    ) => {
      if (season === 0 && title) {
        // Slug-based URL only for Season 0 (Specials): /embed/{title-slug}-s{SS}e{EE}
        const slug = title
          .toLowerCase()
          .replace(/['\u2019\u2018`]/g, "-") // apostrophes → hyphens (e.g. "India's" → "india-s")
          .replace(/[^a-z0-9\s-]/g, "") // strip remaining special chars
          .trim()
          .replace(/\s+/g, "-") // spaces → hyphens
          .replace(/-+/g, "-"); // collapse consecutive hyphens
        const s = String(season).padStart(2, "0"); // season 0 → s00
        const e = String(episode).padStart(2, "0");
        return `https://cineverse.modiplay.xyz/embed/${slug}-s${s}e${e}`;
      }
      // Fallback to ID-based URL (movies still use this)
      const id = imdbId || tmdbId;
      const type = imdbId ? "imdb" : "tmdb";
      return `https://cineverse.modiplay.xyz/embed/${type}/tv?id=${id}&s=${season}&e=${episode}`;
    },
    icon: Globe,
  },
  {
    name: "Server 2",
    id: "server-2",
    movieUrl: (tmdbId: string) =>
      `https://player.vidlove.cc/embed/movie/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://player.vidlove.cc/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    name: "Server 3",
    id: "server-3",
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
    name: "Server 4",
    id: "server-4",
    movieUrl: (tmdbId: string) =>
      `https://play.xpass.top/e/movie/${tmdbId}?autostart=false`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://play.xpass.top/e/tv/${tmdbId}/${season}/${episode}?autostart=false`,
  },
  {
    name: "Server 5",
    id: "server-5",
    movieUrl: (tmdbId: string) =>
      `https://player.vidzee.wtf/embed/movie/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://player.vidzee.wtf/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    name: "Server 6",
    id: "server-6",
    movieUrl: (tmdbId: string) => `https://player.videasy.net/movie/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://player.videasy.net/tv/${tmdbId}/${season}/${episode}`,
  },

  {
    name: "Server 7",
    id: "server-7",
    movieUrl: (tmdbId: string, startAt?: number) =>
      `https://vidbolt.xyz/movie/${tmdbId}?theme=2563eb${startAt ? `&startAt=${startAt}` : ""}`,
    tvUrl: (
      tmdbId: string,
      season: number,
      episode: number,
      startAt?: number,
    ) =>
      `https://vidbolt.xyz/tv/${tmdbId}/${season}/${episode}?theme=2563eb${startAt ? `&startAt=${startAt}` : ""}`,
    trackingType: "vidbolt",
  },
  {
    name: "Server 8",
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
    name: "Server 9",
    id: "server-9",
    movieUrl: (tmdbId: string) =>
      `https://streams.iqsmartgames.com/embed/movie/${tmdbId}?key=e11a7debaaa4f5d25b671706ffe4d2acb56efbd4`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://streams.iqsmartgames.com/embed/tv/${tmdbId}/${season}/${episode}?key=e11a7debaaa4f5d25b671706ffe4d2acb56efbd4`,
    description: "Multi-Language",
    icon: Globe,
  },
  {
    name: "Server 10",
    id: "server-10",
    movieUrl: (tmdbId: string) =>
      `https://embed.vidrift.in/embed/movie/${tmdbId}?brand=Binge%20Cloud&brandColor=2563eb`,
    tvUrl: (
      tmdbId: string,
      season: number,
      episode: number,
      _startAt?: number,
      _imdbId?: string,
      title?: string,
    ) => {
      const titleParam = title ? `&title=${encodeURIComponent(title)}` : "";
      return `https://embed.vidrift.in/embed/tv/${tmdbId}/${season}/${episode}?brand=Binge%20Cloud&brandColor=2563eb${titleParam}`;
    },
  },
];
