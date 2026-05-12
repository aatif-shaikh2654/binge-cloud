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
    name: "MoviesAPI",
    id: "moviesapi",
    movieUrl: (tmdbId: string) => `https://moviesapi.club/movie/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://moviesapi.club/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    name: "VidEasy",
    id: "videasy",
    movieUrl: (tmdbId: string) => `https://player.videasy.net/movie/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://player.videasy.net/tv/${tmdbId}/${season}/${episode}`,
  },
  // {
  //   name: "VidSrc Embed",
  //   id: "vidsrc-xyz",
  //   movieUrl: (tmdbId: string) => `https://vidsrc.xyz/embed/movie/${tmdbId}`,
  //   tvUrl: (tmdbId: string, season: number, episode: number) =>
  //     `https://vidsrc.xyz/embed/tv/${tmdbId}/${season}-${episode}`,
  // },
  // {
  //   name: "111Movies",
  //   id: "111movies",
  //   movieUrl: (tmdbId: string) => `https://111movies.com/embed/movie/${tmdbId}`,
  //   tvUrl: (tmdbId: string, season: number, episode: number) =>
  //     `https://111movies.com/embed/tv/${tmdbId}/${season}/${episode}`,
  // },
  // {
  //   name: "VidZee",
  //   id: "vidzee",
  //   movieUrl: (tmdbId: string) => `https://vidzee.to/embed/movie/${tmdbId}`,
  //   tvUrl: (tmdbId: string, season: number, episode: number) =>
  //     `https://vidzee.to/embed/tv/${tmdbId}/${season}/${episode}`,
  // },
  // {
  //   name: "VidSrc",
  //   id: "vidsrc-me",
  //   movieUrl: (tmdbId: string) =>
  //     `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`,
  //   tvUrl: (tmdbId: string, season: number, episode: number) =>
  //     `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&s=${season}&e=${episode}`,
  // },
  // {
  //   name: "2Embed",
  //   id: "2embed",
  //   movieUrl: (tmdbId: string) => `https://www.2embed.cc/embed/${tmdbId}`,
  //   tvUrl: (tmdbId: string, season: number, episode: number) =>
  //     `https://www.2embed.cc/embed/${tmdbId}/${season}/${episode}`,
  // },
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
