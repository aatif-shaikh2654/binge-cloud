"use client";

import {
  type AniListMedia,
  type AniListMediaDetail,
} from "@/app/types/anilist";
import AnimeSlider from "@/components/common/AnimeSlider";
import React from "react";
import AnimeCharactersSlider from "../_components/AnimeCharactersSlider";
import AnimeDetailHero from "../_components/AnimeDetailHero";
import AnimeEpisodeSectionContent from "../_components/AnimeEpisodeSectionContent";
import AnimeRelations from "../_components/AnimeRelations";
import { useQuery } from "@tanstack/react-query";
import { getAnimeByGenre } from "@/app/services/anilist.service";

interface AnimeDetailProps {
  details: AniListMediaDetail;
  similarAnime?: AniListMedia[];
}

const AnimeDetail: React.FC<AnimeDetailProps> = ({
  details,
  similarAnime: initialSimilarAnime,
}) => {
  const { data: similarAnimeData } = useQuery({
    queryKey: ["similarAnime", details?.id, details?.genres],
    queryFn: async () => {
      if (details?.genres && details.genres.length > 0) {
        const response = await getAnimeByGenre(details.genres, details.id);
        return response.media || [];
      }
      return [];
    },
    initialData: initialSimilarAnime,
    enabled: !!details?.id && !!details?.genres && details.genres.length > 0,
  });

  const similarAnime = similarAnimeData || [];

  if (!details) return null;

  const characters = details.characters?.edges ?? [];
  const relations = details.relations?.edges ?? [];
  const streamingEpisodes = details.streamingEpisodes ?? [];
  const hasEpisodes =
    details.episodes != null ||
    details.nextAiringEpisode != null ||
    streamingEpisodes.length > 0;

  return (
    <div className="relative min-h-screen w-full bg-background text-white selection:bg-blue-600 selection:text-white pb-10 md:pb-20">
      <AnimeDetailHero details={details} />

      {hasEpisodes && (
        <div className="mt-12">
          <AnimeEpisodeSectionContent
            animeId={details.id}
            totalEpisodes={details.episodes}
            streamingEpisodes={streamingEpisodes}
            nextAiringEpisode={details.nextAiringEpisode}
          />
        </div>
      )}

      {characters.length > 0 && (
        <div className="mt-12">
          <AnimeCharactersSlider characters={characters} />
        </div>
      )}

      {relations.length > 0 && (
        <div className="mt-4 md:mt-12">
          <AnimeRelations relations={relations} />
        </div>
      )}

      {similarAnime.length > 0 && (
        <div className="mt-4">
          <AnimeSlider anime={similarAnime} title="Recommended Anime" />
        </div>
      )}
    </div>
  );
};

export default AnimeDetail;
