"use client";

import { FORMAT_LABEL, STATUS_LABEL } from "@/app/constants/anilist";
import { TMDB_IMAGE_BASE_URL } from "@/app/constants/tmdb";
import { useWatchNavigation } from "@/app/hooks/useWatchNavigation";
import { useHistoryStore } from "@/app/store/useHistoryStore";
import { type AniListMedia } from "@/app/types/anilist";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar, Play, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";

interface AnimeHeroProps {
  anime: AniListMedia[];
}

const AnimeHero: React.FC<AnimeHeroProps> = ({ anime }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const history = useHistoryStore((state) => state.history);
  const { handleWatchClick } = useWatchNavigation();

  if (!anime || anime.length === 0) return null;

  const displayAnime = anime.slice(0, 6);

  return (
    <section className="relative w-full h-[85vh] lg:h-screen overflow-hidden group bg-background">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        speed={800}
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="h-full w-full hero-slider"
      >
        {displayAnime.map((item, index) => {
          const title =
            item.title.english ||
            item.title.romaji ||
            item.title.native ||
            "Unknown";
          // bannerImage is the high-res wide image; fall back to extraLarge cover
          const bgImage =
            item.bannerImage ||
            item.coverImage.extraLarge ||
            item.coverImage.large;
          const format = item.format
            ? (FORMAT_LABEL[item.format] ?? item.format)
            : null;
          const status = item.status
            ? (STATUS_LABEL[item.status] ?? item.status)
            : null;
          const cleanDescription = item.description
            ? item.description.replace(/<[^>]*>/g, "")
            : null;

          const historyItem = history.find(
            (h) => h.id === Number(item.id) && h.media_type === "anime",
          );

          const isResumable = !!historyItem;

          const watchUrl = isResumable
            ? `/anime/watch?id=${item.id}${
                historyItem.episode ? `&ep=${historyItem.episode}` : ""
              }${historyItem.server ? `&server=${historyItem.server}` : ""}`
            : `/anime/watch?id=${item.id}`;

          const resumeText = isResumable
            ? `Resume Ep ${historyItem.episode}`
            : "Watch Now";

          return (
            <SwiperSlide key={item.id} className="relative w-full h-full">
              <div className="relative w-full h-full">
                {bgImage && (
                  <Image
                    src={bgImage}
                    alt={title}
                    fill
                    sizes="100vw"
                    className="object-cover object-top"
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-center px-6 lg:px-20 max-w-4xl z-10">
                  {/* Spotlight Rank */}
                  <div className="flex items-center gap-1.5 mb-2 animate-in fade-in slide-in-from-left-4 duration-1000 delay-300">
                    <span className="text-primary font-black text-xs lg:text-sm uppercase tracking-[0.2em]">
                      # {index + 1} Spotlight
                    </span>
                  </div>

                  {/* Title and Logo */}
                  <div className="mb-4 flex flex-col gap-4">
                    {item.logo_path && (
                      <div className="relative w-[200px] lg:w-[320px] aspect-[3/1]">
                        <Image
                          src={`${TMDB_IMAGE_BASE_URL}/original${item.logo_path}`}
                          alt={title}
                          fill
                          sizes="(max-width: 768px) 200px, 320px"
                          className="object-contain object-left drop-shadow-2xl"
                        />
                      </div>
                    )}
                    <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight drop-shadow-lg line-clamp-1 leading-[130%]">
                      {title}
                    </h1>
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-3 lg:gap-5 mb-2">
                    {item.averageScore != null && (
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm lg:text-base font-black text-yellow-400 tracking-tight">
                          {(item.averageScore / 10).toFixed(1)}
                        </span>
                      </div>
                    )}
                    {item.seasonYear && (
                      <div className="flex items-center gap-2 text-white/80">
                        <Calendar className="w-3.5 h-3.5 text-white/40" />
                        <span className="text-xs lg:text-sm font-bold tracking-tight">
                          {item.seasonYear}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {format && (
                        <span className="uppercase text-[9px] lg:text-[10px] border border-white/10 font-bold text-white/40 px-1.5 py-0.5 rounded tracking-wide">
                          {format}
                        </span>
                      )}
                      {status && (
                        <span
                          className={cn(
                            "uppercase text-[9px] lg:text-[10px] border px-1.5 py-0.5 rounded tracking-wide font-black",
                            item.status === "RELEASING"
                              ? "border-green-500/30 text-green-400 bg-green-500/5"
                              : "border-white/10 text-white/40",
                          )}
                        >
                          {status}
                        </span>
                      )}
                      {item.genres.slice(0, 2).map((g) => (
                        <span
                          key={g}
                          className="uppercase text-[9px] lg:text-[10px] border border-white/15 font-black text-white/60 px-1.5 py-0.5 rounded tracking-wider bg-white/[0.02]"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  {cleanDescription && (
                    <p className="text-white/80 text-xs lg:text-[15px] mb-6 line-clamp-3 max-w-xl font-medium leading-relaxed drop-shadow-md">
                      {cleanDescription}
                    </p>
                  )}

                  <div className="flex items-center gap-3">
                    <Link onClick={handleWatchClick} href={watchUrl}>
                      <Button
                        variant={isResumable ? "premiumBlue" : "premium"}
                        size="xl"
                        className="h-12 text-sm px-6 lg:text-base lg:h-12 lg:px-6"
                      >
                        {isResumable ? (
                          <Play className="w-4 h-4 lg:w-5 lg:h-5 fill-current" />
                        ) : (
                          <FaPlay
                            fill="#000"
                            className="w-4 h-4 lg:w-5 lg:h-5"
                          />
                        )}
                        {resumeText}
                      </Button>
                    </Link>
                    <Link href={`/anime/detail?id=${item.id}`}>
                      <Button
                        variant="glass"
                        size="icon-xl"
                        className="size-11 lg:size-12"
                      >
                        <FiAlertCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Pagination dots with progress timer */}
      <div className="absolute bottom-24 lg:bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
        {displayAnime.map((_, index) => (
          <div
            key={index}
            onClick={() => swiperInstance?.slideTo(index)}
            className={cn(
              "h-2 rounded-full cursor-pointer transition-all duration-300 relative overflow-hidden",
              activeIndex === index ? "w-8 bg-white/20" : "w-2 bg-white/20",
            )}
          >
            {activeIndex === index && (
              <div
                className="absolute top-0 left-0 h-full bg-white"
                style={{ animation: "progress-timer 8s linear forwards" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Thumbnails — use bannerImage (landscape) so aspect-video looks right */}
      <div className="absolute bottom-10 right-10 z-50 hidden lg:flex items-center gap-3">
        {displayAnime.map((item, index) => {
          const thumb =
            item.bannerImage ||
            item.coverImage.extraLarge ||
            item.coverImage.large;
          return (
            <div
              key={item.id}
              onClick={() => swiperInstance?.slideTo(index)}
              className={cn(
                "relative w-20 aspect-video rounded-md overflow-hidden cursor-pointer transition-all duration-300 border",
                activeIndex === index
                  ? "border-white! scale-110 z-10"
                  : "border-white/10 opacity-50 hover:opacity-100",
              )}
            >
              {thumb && (
                <Image
                  src={thumb}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AnimeHero;
