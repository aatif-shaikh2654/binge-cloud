"use client";

import dynamic from "next/dynamic";
import StreamingPlatformsSkeleton from "@/shared/components/sliders/StreamingPlatformsSkeleton";

const StreamingPlatformsSwiper = dynamic(
  () => import("./StreamingPlatformsSwiper"),
  {
    ssr: false,
    loading: () => <StreamingPlatformsSkeleton />,
  },
);

export default function StreamingPlatforms() {
  return <StreamingPlatformsSwiper />;
}
