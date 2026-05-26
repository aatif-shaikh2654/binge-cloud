/**
 * Anime Streaming Server Constants
 */

export interface AnimeServer {
  id: string;
  name: string;
  lang: "sub" | "dub";
  baseUrl: string;
}

export const ANIME_SERVERS: AnimeServer[] = [
  {
    id: "server-1-sub",
    name: "Server 1",
    lang: "sub",
    baseUrl: "https://megaplay.buzz/stream/ani",
  },
  {
    id: "server-1-dub",
    name: "Server 1",
    lang: "dub",
    baseUrl: "https://megaplay.buzz/stream/ani",
  },
  {
    id: "server-2-sub",
    name: "Server 2",
    lang: "sub",
    baseUrl: "https://tryembed.us.cc/embed/anime",
  },
  {
    id: "server-2-dub",
    name: "Server 2",
    lang: "dub",
    baseUrl: "https://tryembed.us.cc/embed/anime",
  },
  {
    id: "server-3-sub",
    name: "Server 3",
    lang: "sub",
    baseUrl: "https://vidnest.fun/anime",
  },
  {
    id: "server-3-dub",
    name: "Server 3",
    lang: "dub",
    baseUrl: "https://vidnest.fun/anime",
  },
  {
    id: "server-4-sub",
    name: "Server 4",
    lang: "sub",
    baseUrl: "https://vidnest.fun/animepahe",
  },
  {
    id: "server-4-dub",
    name: "Server 4",
    lang: "dub",
    baseUrl: "https://vidnest.fun/animepahe",
  },
];
