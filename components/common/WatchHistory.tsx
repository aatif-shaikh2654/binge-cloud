"use client";

import { useHistoryStore } from "@/app/store/useHistoryStore";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

const WatchHistorySkeleton = () => (
  <section className="ps-8! lg:ps-24! md:pt-8 md:pb-4 pb-4 overflow-hidden">
    <div className="flex items-center justify-between mb-8 pe-8! lg:pe-24!">
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-8 bg-white/10 rounded-full" />
        <div className="w-48 h-8 bg-white/5 animate-pulse rounded-md" />
      </div>
    </div>
    <div className="flex gap-4 md:gap-6 overflow-hidden">
      {[...Array(4)].map((_, i) => (
        <Skeleton
          key={i}
          className="w-[240px] md:w-[300px] lg:w-[400px] shrink-0 aspect-video rounded-2xl"
        />
      ))}
    </div>
  </section>
);

import { useAuth } from "@/components/providers/AuthProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const WatchHistorySwiper = dynamic(() => import("./WatchHistorySwiper"), {
  ssr: false,
  loading: () => <WatchHistorySkeleton />,
});

interface WatchHistoryProps {
  filterType?: "anime" | "movie" | "tv";
  initialHistory?: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const WatchHistory = ({ filterType, initialHistory }: WatchHistoryProps) => {
  const { history } = useHistoryStore();
  const [isClient, setIsClient] = useState(false);
  const { user, isLoading: isAuthLoading } = useAuth();
  const queryClient = useQueryClient();

  // Seed React Query cache and Zustand store with server-side fetched data on initial render
  if (
    isClient &&
    user &&
    initialHistory &&
    !queryClient.getQueryData(["history", user.id])
  ) {
    queryClient.setQueryData(["history", user.id], initialHistory);
    useHistoryStore.getState().setHistory(initialHistory);
  }

  useEffect(() => {
    setIsClient(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const { isLoading: isHistoryLoading } = useQuery({
    queryKey: ["history", user?.id],
    enabled: !!user,
  });

  if (!isClient) return null;

  const showSkeleton = isAuthLoading || (!!user && isHistoryLoading);

  if (showSkeleton) {
    return <WatchHistorySkeleton />;
  }

  const filteredHistory = filterType
    ? history.filter((item) => item.media_type === filterType)
    : history;

  if (filteredHistory.length === 0) return null;

  return <WatchHistorySwiper filterType={filterType} />;
};

export default WatchHistory;
