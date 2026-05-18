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
    id: "megaplay-sub",
    name: "Megaplay",
    lang: "sub",
    baseUrl: "https://megaplay.buzz/stream/ani",
  },
  {
    id: "megaplay-dub",
    name: "Megaplay",
    lang: "dub",
    baseUrl: "https://megaplay.buzz/stream/ani",
  },
  {
    id: "tryembed-sub",
    name: "Tryembed",
    lang: "sub",
    baseUrl: "https://tryembed.us.cc/embed/anime",
  },
  {
    id: "tryembed-dub",
    name: "Tryembed",
    lang: "dub",
    baseUrl: "https://tryembed.us.cc/embed/anime",
  },
  {
    id: "vidnest-sub",
    name: "Vidnest",
    lang: "sub",
    baseUrl: "https://vidnest.fun/anime",
  },
  {
    id: "vidnest-dub",
    name: "Vidnest",
    lang: "dub",
    baseUrl: "https://vidnest.fun/anime",
  },
  {
    id: "vidnest-pahe-sub",
    name: "Vidnest (Pahe)",
    lang: "sub",
    baseUrl: "https://vidnest.fun/animepahe",
  },
  {
    id: "vidnest-pahe-dub",
    name: "Vidnest (Pahe)",
    lang: "dub",
    baseUrl: "https://vidnest.fun/animepahe",
  },
];
