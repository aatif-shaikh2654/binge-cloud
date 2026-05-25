"use client";

import { useWatchlistStore } from "@/app/store/useWatchlistStore";
import MovieCard from "@/components/common/MovieCard";
import PageHeader from "@/components/common/PageHeader";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface WatchLaterProps {
  initialWatchlist?: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const WatchLater = ({ initialWatchlist }: WatchLaterProps) => {
  const { watchlist } = useWatchlistStore();
  const [isClient, setIsClient] = useState(false);
  const { user, isLoading: isAuthLoading } = useAuth();
  const queryClient = useQueryClient();

  const { isLoading: isWatchlistLoading } = useQuery({
    queryKey: ["watchlist", user?.id],
    enabled: !!user,
  });

  // Seed React Query cache and Zustand store with server-side fetched data on initial render
  if (isClient && user && initialWatchlist && !queryClient.getQueryData(["watchlist", user.id])) {
    queryClient.setQueryData(["watchlist", user.id], initialWatchlist);
    useWatchlistStore.getState().setWatchlist(initialWatchlist);
  }

  useEffect(() => {
    setIsClient(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  if (!isClient) return null;

  const showSkeleton = isAuthLoading || (!!user && isWatchlistLoading);

  if (showSkeleton) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Watch Later"
          description="Your personal collection of movies and series to watch next."
          className="px-0 lg:px-0"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 md:gap-x-6 md:gap-y-10 gap-x-3 gap-y-6">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="aspect-[2/3] w-full rounded-xl" />
              <div className="flex flex-col gap-1.5 px-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
          <Bookmark className="w-10 h-10 text-white/20" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">
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
    <div className="space-y-8">
      <PageHeader
        title="Watch Later"
        description="Your personal collection of movies and series to watch next."
        className="px-0 lg:px-0"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 md:gap-x-6 md:gap-y-10 gap-x-3 gap-y-6">
        {watchlist.map((item) => (
          <MovieCard
            key={`${item.media_type}-${item.id}`}
            movie={item}
            isWatchLaterPage={true}
          />
        ))}
      </div>
    </div>
  );
};

export default WatchLater;
