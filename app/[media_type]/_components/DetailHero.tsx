"use client";
import { TMDB_IMAGE_BASE_URL } from "@/app/constants/tmdb";
import { useWatchNavigation } from "@/app/hooks/useWatchNavigation";
import { getMovieVideos } from "@/app/services/all.service";
import { useHistoryStore } from "@/app/store/useHistoryStore";
import { useWatchlistStore } from "@/app/store/useWatchlistStore";
import { type MediaType } from "@/app/types/common";
import { type TMDBMovie } from "@/app/types/tmdb";
import ZoomableImage from "@/components/common/ZoomableImage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bookmark, Play, Plus, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { CiVolumeHigh, CiVolumeMute } from "react-icons/ci";
import { FaPlay } from "react-icons/fa";
import { toast } from "sonner";

interface DetailHeroProps {
  details: TMDBMovie;
  tmdbType: MediaType;
}

const DetailHero: React.FC<DetailHeroProps> = ({ details, tmdbType }) => {
  const { toggleWatchlist, isInWatchlist } = useWatchlistStore();
  const { handleWatchClick } = useWatchNavigation();
  const history = useHistoryStore((state) => state.history);

  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const toggleMute = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: isMuted ? "unMute" : "mute",
          args: [],
        }),
        "*",
      );
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchVideo = async () => {
      try {
        const type = tmdbType === "tv" ? "tv" : "movie";
        const videos = await getMovieVideos(details.id, type);
        const trailer =
          videos.results?.find(
            (v: { type: string; site: string; key: string }) =>
              v.type === "Trailer" && v.site === "YouTube",
          ) || videos.results?.[0];
        if (trailer && isMounted) {
          setVideoKey(trailer.key);
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };
    fetchVideo();
    return () => {
      isMounted = false;
    };
  }, [details.id, tmdbType]);

  const inWatchlist = isInWatchlist(details.id, tmdbType);

  const historyItem = history.find(
    (h) => h.id === details.id && h.media_type === tmdbType,
  );

  const isResumable = !!historyItem;

  const handleWatchlistToggle = () => {
    toggleWatchlist({
      ...details,
      media_type: tmdbType,
      title: details.title || details.name,
    });
    if (inWatchlist) {
      toast.error(`Removed from Watchlist`);
    } else {
      toast.success(`Added to Watchlist`);
    }
  };
  const releaseYear = new Date(
    details?.release_date || details?.first_air_date || "",
  ).getFullYear();
  const rating = details?.vote_average
    ? (details.vote_average * 10).toFixed(0)
    : "0";
  const runtime = details?.runtime || details?.episode_run_time?.[0] || 0;

  const watchUrl = isResumable
    ? `/${tmdbType}/watch?id=${details.id}${
        historyItem.server ? `&server=${historyItem.server}` : ""
      }${historyItem.season ? `&season=${historyItem.season}` : ""}${
        historyItem.episode ? `&episode=${historyItem.episode}` : ""
      }`
    : `/${tmdbType}/watch?id=${details.id}`;

  const resumeText = isResumable
    ? tmdbType === "tv"
      ? `Resume S${historyItem.season} E${historyItem.episode}`
      : "Resume Watching"
    : "Watch Now";

  return (
    <>
      {/* Cinematic Background Backdrop */}
      <div className="absolute inset-0 w-full h-[58vh] md:h-[80vh] lg:h-screen overflow-hidden bg-background">
        {/* Base Image */}
        {details.backdrop_path || details.poster_path ? (
          <Image
            src={`${TMDB_IMAGE_BASE_URL}/original${details.backdrop_path || details.poster_path}`}
            alt={details.title || details.name || "Backdrop"}
            fill
            sizes="100vw"
            className="object-cover opacity-50 md:opacity-40 blur-none md:blur-[1px] scale-105 animate-in fade-in duration-1000"
            priority
          />
        ) : null}

        {/* Video Layer */}
        {videoKey && (
          <div className="absolute w-full h-full pointer-events-none">
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&loop=1&playlist=${videoKey}&enablejsapi=1&disablekb=1&iv_load_policy=3&playsinline=1&fs=0&vq=hd1080`}
              className={cn(
                "w-full h-full scale-[2.5] md:scale-[1.8] lg:scale-[1.5] transition-opacity duration-1000",
                isVideoLoaded ? "opacity-100" : "opacity-0",
              )}
              onLoad={() => setIsVideoLoaded(true)}
              allow="autoplay; encrypted-media"
            />
          </div>
        )}

        {/* Dark Overlays - Reduced layer on video */}
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-background via-background/30 md:via-background/50 to-transparent" />
      </div>

      {/* Hero Section: Poster & Main Info */}
      <div className="relative z-10 container mx-auto px-6 lg:px-20 pt-[45vh] md:pt-[60vh] lg:pt-[642px] flex flex-col items-start text-left lg:flex-row gap-8 lg:gap-20 min-h-[75vh] md:min-h-[90vh] lg:min-h-[95vh] pb-10">
        {/* Mute Button (Top Right) */}
        {videoKey && (
          <div className="absolute md:top-10 md:right-8 top-7 right-6 z-50">
            <Button
              variant="glass"
              size="icon-xl"
              className="size-12 lg:size-16 transition-all duration-300 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border-white/20"
              onClick={toggleMute}
            >
              {isMuted ? (
                <CiVolumeMute className="w-5! h-5! lg:w-8! lg:h-8! text-white" />
              ) : (
                <CiVolumeHigh className="w-5! h-5! lg:w-8! lg:h-8! text-white" />
              )}
            </Button>
          </div>
        )}

        {/* Poster - More subtle animation */}
        <div className="w-32 md:w-48 lg:w-64 shrink-0 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8)] transition-all duration-700 hover:scale-[1.02] hover:border-white/20 group">
            {details.poster_path && (
              <ZoomableImage
                src={`${TMDB_IMAGE_BASE_URL}/w500${details.poster_path}`}
                originalImageSrc={`${TMDB_IMAGE_BASE_URL}/original${details.poster_path}`}
                alt={details.title || details.name || "Poster"}
                fill
                sizes="256px"
                imageClassName="object-cover group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Info Content - staggered feel with slide-up */}
        <div className="flex-1 max-w-3xl space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200 fill-mode-backwards w-full">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-start gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 text-[10px] font-black uppercase tracking-wider">
                <Star className="w-3 h-3 fill-green-500" />
                {rating}% Match
              </div>
              {!isNaN(releaseYear) && (
                <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                  {releaseYear}
                </span>
              )}
              <span className="text-white/60 text-[10px] font-black tracking-widest px-1.5 py-0.5 border border-white/10 rounded">
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

            <div className="flex flex-wrap items-center justify-start gap-2">
              {details.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 rounded-full border border-white/20 bg-white/5 text-[9px] lg:text-[10px] font-black text-white/90 tracking-tight"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons - Slightly smaller */}
          <div className="flex flex-wrap items-center justify-start gap-3">
            <Link href={watchUrl} onClick={handleWatchClick}>
              <Button
                variant={isResumable ? "premiumBlue" : "premium"}
                size="xl"
                className="h-12 text-sm px-6 lg:text-base lg:h-12 lg:px-6"
              >
                {isResumable ? (
                  <Play className="w-4 h-4 lg:w-5 lg:h-5 fill-current" />
                ) : (
                  <FaPlay fill="#000" className="w-4 h-4 lg:w-5 lg:h-5" />
                )}
                {resumeText}
              </Button>
            </Link>
            <Button
              variant={inWatchlist ? "premium" : "glass"}
              size="icon-xl"
              className={cn(
                "size-11 lg:size-12 transition-all duration-300",
                inWatchlist && "bg-white text-black hover:bg-white/90",
              )}
              onClick={handleWatchlistToggle}
            >
              {inWatchlist ? (
                <Bookmark className="w-4 h-4 lg:w-5 lg:h-5 fill-black" />
              ) : (
                <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
              )}
            </Button>
          </div>

          <div className="space-y-3 max-w-2xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center justify-start gap-3">
              Storyline
              <div className="h-px flex-1 bg-white/10 hidden lg:block" />
            </h3>
            <p className="text-sm md:text-lg text-white/80 leading-relaxed font-medium">
              {details.overview}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailHero;
