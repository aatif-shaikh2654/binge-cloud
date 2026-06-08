"use client";

import { getSimilarMedia } from "@/app/services/all.service";
import { type MediaType } from "@/app/types/common";
import MediaSlider from "@/components/common/MediaSlider";
import SliderSkeleton from "@/components/common/SliderSkeleton";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface RelatedMediaProps {
  id: string | number;
  tmdbType: MediaType;
}

const RelatedMedia: React.FC<RelatedMediaProps> = ({ id, tmdbType }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["related-media", id, tmdbType],
    queryFn: () => getSimilarMedia(id, tmdbType),
    enabled: !!id,
  });

  const movies = data?.results || [];

  if (isLoading) {
    return (
      <div className="mt-12 md:mt-24">
        <SliderSkeleton
          title={`Related ${tmdbType === "movie" ? "Movies" : "Series"}`}
        />
      </div>
    );
  }

  if (movies.length === 0) return null;

  return (
    <div className="mt-12 md:mt-24">
      <MediaSlider
        movies={movies}
        title={`Related ${tmdbType === "movie" ? "Movies" : "Series"}`}
        media_type={tmdbType}
        seeAllHref={`/${tmdbType}?related_to=${id}`}
      />
    </div>
  );
};

export default RelatedMedia;
