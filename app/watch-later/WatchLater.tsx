"use client";

import { useWatchlistStore } from "@/app/store/useWatchlistStore";
import MovieCard from "@/components/common/MovieCard";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const WatchLater = () => {
  const { watchlist } = useWatchlistStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  if (!isClient) return null;

  if (watchlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
          <Bookmark className="w-10 h-10 text-white/20" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">
          Watchlist Empty
        </h2>
        <p className="text-white/40 max-w-sm font-medium tracking-tight">
          Save movies and series to watch later. Your saved content will appear
          here.
        </p>
        <Link href="/">
          <Button variant="premium" className="mt-8 px-8">
            Start Exploring
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title="Watch Later"
        description="Your personal collection of movies and series to watch next."
        className="px-0 lg:px-0"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 md:gap-x-6 md:gap-y-10 gap-x-3 gap-y-6">
        {watchlist.map((item) => (
          <MovieCard key={`${item.media_type}-${item.id}`} movie={item} />
        ))}
      </div>
    </div>
  );
};

export default WatchLater;
