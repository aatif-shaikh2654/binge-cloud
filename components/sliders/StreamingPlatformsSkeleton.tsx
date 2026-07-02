"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StreamingPlatformsSkeletonProps {
  className?: string;
}

export default function StreamingPlatformsSkeleton({ className }: StreamingPlatformsSkeletonProps) {
  return (
    <section
      className={cn(
        "ps-6! lg:ps-20! md:py-6 pb-6 relative z-10 overflow-hidden",
        className,
      )}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 pe-8! lg:pe-20!">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-8 bg-blue-600/30 rounded-full animate-pulse" />
          <h2 className="text-2xl font-black tracking-tight text-white/20">
            Streaming Platforms
          </h2>
        </div>
      </div>

      {/* Slider Placeholder */}
      <div className="flex gap-4 overflow-hidden!">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="w-[200px] sm:w-[220px] md:w-[240px] lg:w-[260px] xl:w-[280px] shrink-0 pb-4"
          >
            <Skeleton className="aspect-video w-full md:rounded-2xl rounded-lg bg-white/5" />
          </div>
        ))}
      </div>
    </section>
  );
}
