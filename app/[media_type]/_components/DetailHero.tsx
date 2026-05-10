"use client";

import React from "react";
import Image from "next/image";
import { Star, Plus, Share2 } from "lucide-react";
import { type TMDBMovie } from "@/app/types/tmdb";
import { TMDB_IMAGE_BASE_URL } from "@/app/constants/tmdb";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaPlay } from "react-icons/fa";

interface DetailHeroProps {
  details: TMDBMovie;
  tmdbType: "movie" | "tv";
}

const DetailHero: React.FC<DetailHeroProps> = ({ details, tmdbType }) => {
  const releaseYear = new Date(
    details?.release_date || details?.first_air_date || "",
  ).getFullYear();
  const rating = details?.vote_average
    ? (details.vote_average * 10).toFixed(0)
    : "0";
  const runtime = details?.runtime || details?.episode_run_time?.[0] || 0;

  const watchUrl = `/${tmdbType}/watch?id=${details.id}`;

  return (
    <>
      {/* Cinematic Background Backdrop */}
      <div className="absolute inset-0 w-full h-[85vh] overflow-hidden">
        {details.backdrop_path || details.poster_path ? (
          <Image
            src={`${TMDB_IMAGE_BASE_URL}/original${details.backdrop_path || details.poster_path}`}
            alt={details.title || details.name || "Backdrop"}
            fill
            sizes="100vw"
            className="object-cover opacity-20 blur-[3px] scale-105 animate-in fade-in duration-1000"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Hero Section: Poster & Main Info */}
      <div className="relative z-10 container mx-auto px-6 lg:px-20 pt-32 lg:pt-48 flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* Poster - More subtle animation */}
        <div className="hidden lg:block w-64 shrink-0 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8)] transition-all duration-700 hover:scale-[1.02] hover:border-white/20 group">
            {details.poster_path && (
              <Image
                src={`${TMDB_IMAGE_BASE_URL}/w500${details.poster_path}`}
                alt={details.title || details.name || "Poster"}
                fill
                sizes="256px"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </div>

        {/* Info Content - staggered feel with slide-up */}
        <div className="flex-1 max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200 fill-mode-backwards">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 text-[10px] font-black uppercase tracking-wider">
                <Star className="w-3 h-3 fill-green-500" />
                {rating}% Match
              </div>
              {!isNaN(releaseYear) && (
                <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                  {releaseYear}
                </span>
              )}
              <span className="text-white/60 text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 border border-white/10 rounded">
                {tmdbType === "movie" ? "Movie" : "TV"}
              </span>
              {runtime > 0 && (
                <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                  {runtime}m
                </span>
              )}
            </div>

            {/* Reduced Font Sizes */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black! tracking-tight leading-[1.05] drop-shadow-2xl text-white/95">
              {details.title || details.name}
            </h1>

            {details.tagline && (
              <p className="text-lg md:text-xl font-medium text-white/60 italic max-w-2xl leading-relaxed">
                {details.tagline}
              </p>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {details.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="text-[10px] font-black uppercase tracking-widest text-blue-500/80 hover:text-blue-500 transition-colors cursor-default"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons - Slightly smaller */}
          <div className="flex flex-wrap items-center gap-3">
            <Link href={watchUrl}>
              <Button
                variant="premium"
                size="xl"
                className="h-12 text-sm px-6 lg:text-base lg:h-12 lg:px-6"
              >
                <FaPlay fill="#000" className="w-4 h-4 lg:w-5 lg:h-5" /> Watch
                Now
              </Button>
            </Link>
            <button className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all hover:scale-[1.05] active:scale-90">
              <Plus className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all hover:scale-[1.05] active:scale-90">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 max-w-2xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-3">
              Storyline
              <div className="h-px flex-1 bg-white/10" />
            </h3>
            <p className="text-base md:text-lg text-white/80 leading-relaxed font-medium">
              {details.overview}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailHero;
