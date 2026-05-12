"use client";

import { type AniListMedia } from "@/app/types/anilist";
import React from "react";
import AnimeHeroSwiper from "./AnimeHeroSwiper";

interface AnimeHeroProps {
  anime: AniListMedia[];
}

const AnimeHero: React.FC<AnimeHeroProps> = (props) => {
  return <AnimeHeroSwiper {...props} />;
};

export default AnimeHero;
