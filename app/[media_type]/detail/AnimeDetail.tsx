"use client";

import { type AniListMediaDetail } from "@/app/types/anilist";
import React from "react";
import AnimeCharactersSlider from "../_components/AnimeCharactersSlider";
import AnimeDetailHero from "../_components/AnimeDetailHero";
import AnimeEpisodeSection from "../_components/AnimeEpisodeSection";
import AnimeRelations from "../_components/AnimeRelations";

interface AnimeDetailProps {
  details: AniListMediaDetail;
}

const AnimeDetail: React.FC<AnimeDetailProps> = ({ details }) => {
  if (!details) return null;

  const characters = details.characters?.edges ?? [];
  const relations = details.relations?.edges ?? [];
  const streamingEpisodes = details.streamingEpisodes ?? [];
  const hasEpisodes =
    details.episodes != null ||
    details.nextAiringEpisode != null ||
    streamingEpisodes.length > 0;

  console.log(details);
  return (
    <div className="relative min-h-screen w-full bg-background text-white selection:bg-blue-600 selection:text-white pb-10 md:pb-20">
      <AnimeDetailHero details={details} />

      {hasEpisodes && (
        <div className="mt-12 md:mt-24">
          <AnimeEpisodeSection
            animeId={details.id}
            totalEpisodes={details.episodes}
            streamingEpisodes={streamingEpisodes}
            nextAiringEpisode={details.nextAiringEpisode}
          />
        </div>
      )}

      {characters.length > 0 && (
        <div className="mt-12 md:mt-24">
          <AnimeCharactersSlider characters={characters} />
        </div>
      )}

      {relations.length > 0 && (
        <div className="mt-12 md:mt-24">
          <AnimeRelations relations={relations} />
        </div>
      )}
    </div>
  );
};

export default AnimeDetail;
