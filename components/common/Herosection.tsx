"use client";

import { type TMDBMovie } from "@/app/types/tmdb";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import HerosectionSwiper from "./HerosectionSwiper";

interface HerosectionProps {
  movies: TMDBMovie[];
}

const HerosectionSkeleton = () => (
  <section className="relative w-full h-[85vh] lg:h-screen overflow-hidden bg-background">
    <Skeleton className="w-full h-full" />
    <div className="absolute inset-0 flex flex-col justify-center px-6 lg:px-24 max-w-4xl z-10">
      <Skeleton className="h-16 w-64 lg:w-96 mb-6" />
      <div className="flex gap-4 mb-6">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Skeleton className="h-24 w-full max-w-xl mb-8" />
      <div className="flex gap-4">
        <Skeleton className="h-12 w-40 rounded-full" />
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    </div>
  </section>
);

const Herosection: React.FC<HerosectionProps> = (props) => {
  return <HerosectionSwiper {...props} />;
};

export default Herosection;
