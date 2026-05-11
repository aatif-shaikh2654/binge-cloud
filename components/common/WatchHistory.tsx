"use client";

import { useHistoryStore } from "@/lib/store/useHistoryStore";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";

// Import Slick styles
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const WatchHistory = () => {
  const { history, removeFromHistory } = useHistoryStore();
  const [isClient, setIsClient] = useState(false);
  const sliderRef = useRef<Slider>(null);

  useEffect(() => {
    setIsClient(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  if (!isClient || history.length === 0) return null;

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4.5,
    slidesToScroll: 2,
    arrows: false,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4.5,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="ps-8! lg:ps-24! md:py-8 pb-12 overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 pe-8! lg:pe-24!">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-8 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
            Continue Watching
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          </h2>
        </div>

        {/* Custom Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => sliderRef.current?.slickPrev()}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all active:scale-90"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => sliderRef.current?.slickNext()}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all active:scale-90"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Slider Container */}
      <div className="movie-slider-container">
        <Slider ref={sliderRef} {...settings}>
          {history.map((item) => (
            <div key={item.id} className="px-2 pb-4">
              <div className="group relative w-full aspect-video rounded-2xl overflow-hidden border border-white/5 bg-white/5 hover:border-blue-500/30 transition-all duration-500">
                <Link
                  href={`/${item.media_type === "tv" ? "series" : "movie"}/watch?id=${item.id}&server=${item.server}${item.season ? `&season=${item.season}&episode=${item.episode}` : ""}`}
                  className="block w-full h-full"
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] transform scale-75 group-hover:scale-100 transition-transform duration-500">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-[15px] font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1.5 flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                        {item.media_type === "tv" ? "Series" : "Movie"}
                      </span>
                      {item.media_type === "tv" && (
                        <span>
                          S{item.season} • E{item.episode}
                        </span>
                      )}
                    </p>
                  </div>
                </Link>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromHistory(item.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-full text-white/40 hover:text-white hover:bg-red-500/80 transition-all opacity-0 group-hover:opacity-100 z-10 border border-white/10 shadow-lg"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default WatchHistory;
