"use client";

import React from "react";
import { type TMDBMovie, type TMDBCreditsResponse } from "@/app/types/tmdb";
import { type MediaType } from "@/app/types/common";
import EpisodeSection from "../_components/EpisodeSection";
import DetailHero from "../_components/DetailHero";
import dynamic from "next/dynamic";

const CastSlider = dynamic(() => import("../_components/CastSlider"), {
  ssr: false,
});

const RelatedMedia = dynamic(() => import("../_components/RelatedMedia"), {
  ssr: false,
});

interface DetailProps {
  details: TMDBMovie;
  credits: TMDBCreditsResponse;
  tmdbType: MediaType;
}

const Detail: React.FC<DetailProps> = ({ details, credits, tmdbType }) => {
  if (!details) return null;

  return (
    <div className="relative min-h-screen w-full bg-background text-white selection:bg-blue-600 selection:text-white pb-10 md:pb-20">
      <DetailHero details={details} tmdbType={tmdbType} />

      {/* Episodes Section (For TV Shows) */}
      {tmdbType === "tv" && details.seasons && (
        <div className="relative z-10 container mx-auto px-6 lg:px-20">
          <EpisodeSection tvId={details.id} seasons={details.seasons} />
        </div>
      )}

      {/* Dedicated Cast Section: Spans Full Width */}
      {credits?.cast && credits.cast.length > 0 && (
        <div className="relative z-10 mt-12 md:mt-24">
          <CastSlider cast={credits.cast} />
        </div>
      )}

      {/* Related Media Section */}
      <div className="relative z-10">
        <RelatedMedia id={details.id} tmdbType={tmdbType} />
      </div>
    </div>
  );
};

export default Detail;
