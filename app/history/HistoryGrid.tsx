"use client";

import { Button } from "@/components/ui/button";
import { useHistoryStore } from "@/lib/store/useHistoryStore";
import { Clock, Play, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageHeader from "@/components/common/PageHeader";

const HistoryGrid = () => {
  const { history, removeFromHistory, clearHistory } = useHistoryStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  if (!isClient) return null;

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
          <Clock className="w-10 h-10 text-white/20" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">No History Yet</h2>
        <p className="text-white/40 max-w-sm">
          Movies and series you watch will appear here so you can easily resume
          them.
        </p>
        <Link href="/">
          <Button variant="premium" className="mt-8 px-8">
            Explore Content
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title="Watch History"
        description="Manage and resume your recently watched content."
        className="px-0 lg:px-0"
      >
        <Button
          variant="destructive"
          size="sm"
          onClick={clearHistory}
          className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20 rounded-full px-6 h-10 font-black uppercase text-[10px] tracking-widest"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {history.map((item) => (
          <div
            key={`${item.media_type}-${item.id}`}
            className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all duration-500"
          >
            <Link
              href={`/${item.media_type === "tv" ? "series" : "movie"}/watch?id=${item.id}&server=${item.server}${item.season ? `&season=${item.season}&episode=${item.episode}` : ""}`}
              className="block"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-5 h-5 fill-white text-white ml-1" />
                  </div>
                </div>
                {item.media_type === "tv" && (
                  <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-black uppercase border border-white/10">
                    S{item.season} • E{item.episode}
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-lg font-black text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 bg-white/5 px-2 py-1 rounded">
                    {item.media_type === "tv" ? "Series" : "Movie"}
                  </span>
                  <span className="text-[10px] font-medium text-white/20">
                    Watched {new Date(item.watchedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>

            <button
              onClick={(e) => {
                e.preventDefault();
                removeFromHistory(item.id);
              }}
              className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-full text-white/40 hover:text-white hover:bg-red-500/80 transition-all opacity-0 group-hover:opacity-100 z-10 border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryGrid;
