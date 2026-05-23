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

const WatchHistorySwiper = dynamic(() => import("./WatchHistorySwiper"), {
  ssr: false,
  loading: () => <WatchHistorySkeleton />,
});

interface WatchHistoryProps {
  filterType?: "anime" | "movie" | "tv";
}

const WatchHistory = ({ filterType }: WatchHistoryProps) => {
  const { history } = useHistoryStore();

  const filteredHistory = filterType
    ? history.filter((item) => item.media_type === filterType)
    : history;

  if (filteredHistory.length === 0) return null;

  return <WatchHistorySwiper filterType={filterType} />;
};

export default WatchHistory;
