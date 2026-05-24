/**
 * Video Player Server Constants
 */

export interface PlayerServer {
  name: string;
  id: string;
  movieUrl: (tmdbId: string) => string;
  tvUrl: (tmdbId: string, season: number, episode: number) => string;
}

export const PLAYER_SERVERS: PlayerServer[] = [
  {
    name: "Vidnest",
    id: "vidnest",
    movieUrl: (tmdbId: string) => `https://vidnest.fun/movie/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://vidnest.fun/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    name: "XPass",
    id: "xpass",
    movieUrl: (tmdbId: string) =>
      `https://play.xpass.top/e/movie/${tmdbId}?autostart=false`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://play.xpass.top/e/tv/${tmdbId}/${season}/${episode}?autostart=false`,
  },
  {
    name: "VidLink",
    id: "vidlink",
    movieUrl: (tmdbId: string) => `https://vidlink.pro/movie/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    name: "VidEasy",
    id: "videasy",
    movieUrl: (tmdbId: string) => `https://player.videasy.net/movie/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://player.videasy.net/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    name: "111Movies",
    id: "111movies",
    movieUrl: (tmdbId: string) => `https://111movies.com/movie/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://111movies.com/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    name: "VidZee",
    id: "vidzee",
    movieUrl: (tmdbId: string) =>
      `https://player.vidzee.wtf/embed/movie/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://player.vidzee.wtf/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    name: "2Embed",
    id: "2embed",
    movieUrl: (tmdbId: string) => `https://www.2embed.cc/embed/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://www.2embed.cc/embed/${tmdbId}/${season}/${episode}`,
  },
  {
    name: "MoviesAPI",
    id: "moviesapi",
    movieUrl: (tmdbId: string) => `https://moviesapi.club/movie/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://moviesapi.club/tv/${tmdbId}/${season}/${episode}`,
  },
  // {
  //   name: "Maple",
  //   id: "maple",
  //   movieUrl: (tmdbId: string) =>
  //     `https://maplemovie.site/embed/movie/${tmdbId}`,
  //   tvUrl: (tmdbId: string, season: number, episode: number) =>
  //     `https://maplemovie.site/embed/tv/${tmdbId}/${season}/${episode}`,
  // },
  // {
  //   name: "PrimeSrc",
  //   id: "primesrc",
  //   movieUrl: (tmdbId: string) => `https://primesrc.xyz/embed/movie/${tmdbId}`,
  //   tvUrl: (tmdbId: string, season: number, episode: number) =>
  //     `https://primesrc.xyz/embed/tv/${tmdbId}/${season}/${episode}`,
  // },
  // {
  //   name: "MultiEmbed",
  //   id: "multiembed",
  //   movieUrl: (tmdbId: string) =>
  //     `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1`,
  //   tvUrl: (tmdbId: string, season: number, episode: number) =>
  //     `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`,
  // },
  // {
  //   name: "AutoEmbed",
  //   id: "autoembed",
  //   movieUrl: (tmdbId: string) => `https://autoembed.to/movie/tmdb/${tmdbId}`,
  //   tvUrl: (tmdbId: string, season: number, episode: number) =>
  //     `https://autoembed.to/tv/tmdb/${tmdbId}/${season}/${episode}`,
  // },
];
