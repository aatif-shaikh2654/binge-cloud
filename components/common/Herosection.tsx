"use client";

import { type TMDBMovie } from "@/app/types/tmdb";
import React from "react";
import HerosectionSwiper from "./HerosectionSwiper";

interface HerosectionProps {
  movies: TMDBMovie[];
}

const Herosection: React.FC<HerosectionProps> = (props) => {
  return <HerosectionSwiper {...props} />;
};

export default Herosection;
