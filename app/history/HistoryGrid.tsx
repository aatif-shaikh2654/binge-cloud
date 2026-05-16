"use client";

import { useHistoryStore } from "@/app/store/useHistoryStore";
import HistoryCard from "@/components/common/HistoryCard";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Clock, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const HistoryGrid = () => {
  const { history, clearHistory } = useHistoryStore();
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
          className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20 rounded-full px-6 h-10 mb-2 font-black uppercase text-[10px] tracking-widest"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {history.map((item) => (
          <HistoryCard key={`${item.media_type}-${item.id}`} item={item} />
        ))}
      </div>
    </div>
  );
};

export default HistoryGrid;
