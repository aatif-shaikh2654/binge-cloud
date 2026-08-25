"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";

interface SliderSkeletonProps {
  title?: string;
  className?: string;
}

export const SliderSkeleton = ({ title, className }: SliderSkeletonProps) => (
  <section
    className={cn(
      "ps-8! lg:ps-20! md:py-6 pb-6 relative z-10 overflow-hidden",
      className,
    )}
  >
    <div className="flex items-center justify-between mb-8 pe-8! lg:pe-24!">
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-8 bg-white/10 rounded-full" />
        {title ? (
          <h2 className="text-2xl font-black tracking-tight text-white/20">
            {title}
          </h2>
        ) : (
          <div className="w-48 h-8 bg-white/5 animate-pulse rounded-md" />
        )}
      </div>
    </div>
    <div className="flex gap-4 md:gap-6 overflow-hidden!">
      {[...Array(9)].map((_, i) => (
        <div
          key={i}
          className="w-[135px] sm:w-[150px] md:w-[160px] lg:w-[165px] xl:w-[175px] 2xl:w-[185px] shrink-0 flex flex-col gap-3"
        >
          <Skeleton className="aspect-2/3 w-full rounded-xl" />
          <div className="space-y-2 px-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default SliderSkeleton;
