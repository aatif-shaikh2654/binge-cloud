"use client";

import { type AniListMediaDetail } from "@/app/types/anilist";
import React from "react";
import AnimeCharactersSlider from "../_components/AnimeCharactersSlider";
import AnimeDetailHero from "../_components/AnimeDetailHero";
import AnimeRelations from "../_components/AnimeRelations";

interface AnimeDetailProps {
  details: AniListMediaDetail;
}

const AnimeDetail: React.FC<AnimeDetailProps> = ({ details }) => {
  if (!details) return null;

  const characters = details.characters?.edges ?? [];
  const relations = details.relations?.edges ?? [];

  return (
    <div className="relative min-h-screen w-full bg-background text-white selection:bg-blue-600 selection:text-white pb-10 md:pb-20">
      <AnimeDetailHero details={details} />

      {characters.length > 0 && (
        <div className="relative z-10 mt-12 md:mt-24">
          <div className="container mx-auto px-6 lg:px-20">
            <AnimeCharactersSlider characters={characters} />
          </div>
        </div>
      )}

      {relations.length > 0 && (
        <div className="relative z-10 mt-12 md:mt-24">
          <div className="container mx-auto px-6 lg:px-20">
            <AnimeRelations relations={relations} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeDetail;
