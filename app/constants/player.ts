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
    movieUrl: (tmdbId: string) => `https://vidlink.pro/movie/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    name: "Server 4",
    id: "server-4",
    movieUrl: (tmdbId: string) => `https://player.videasy.net/movie/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://player.videasy.net/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    name: "Server 5",
    id: "server-5",
    movieUrl: (tmdbId: string) => `https://111movies.com/movie/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://111movies.com/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    name: "Server 6",
    id: "server-6",
    movieUrl: (tmdbId: string) =>
      `https://player.vidzee.wtf/embed/movie/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://player.vidzee.wtf/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    name: "Server 7",
    id: "server-7",
    movieUrl: (tmdbId: string) => `https://www.2embed.cc/embed/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://www.2embed.cc/embed/${tmdbId}/${season}/${episode}`,
  },
  {
    name: "Server 8",
    id: "server-8",
    movieUrl: (tmdbId: string) => `https://moviesapi.club/movie/${tmdbId}`,
    tvUrl: (tmdbId: string, season: number, episode: number) =>
      `https://moviesapi.club/tv/${tmdbId}/${season}/${episode}`,
  },
  // {
  //   name: "Server 9",
  //   id: "server-9",
  //   movieUrl: (tmdbId: string) =>
  //     `https://maplemovie.site/embed/movie/${tmdbId}`,
  //   tvUrl: (tmdbId: string, season: number, episode: number) =>
  //     `https://maplemovie.site/embed/tv/${tmdbId}/${season}/${episode}`,
  // },
  // {
  //   name: "Server 10",
  //   id: "server-10",
  //   movieUrl: (tmdbId: string) => `https://primesrc.xyz/embed/movie/${tmdbId}`,
  //   tvUrl: (tmdbId: string, season: number, episode: number) =>
  //     `https://primesrc.xyz/embed/tv/${tmdbId}/${season}/${episode}`,
  // },
  // {
  //   name: "Server 11",
  //   id: "server-11",
  //   movieUrl: (tmdbId: string) =>
  //     `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1`,
  //   tvUrl: (tmdbId: string, season: number, episode: number) =>
  //     `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`,
  // },
  // {
  //   name: "Server 12",
  //   id: "server-12",
  //   movieUrl: (tmdbId: string) => `https://autoembed.to/movie/tmdb/${tmdbId}`,
  //   tvUrl: (tmdbId: string, season: number, episode: number) =>
  //     `https://autoembed.to/tv/tmdb/${tmdbId}/${season}/${episode}`,
  // },
];
