import type { Metadata } from "next";
import Search from "./Search";

export const metadata: Metadata = {
  title: "Search",
  description: "Search for your favorite movies and TV shows on Binge Cloud.",
};

const page = () => {
  return <Search />;
};

export default page;
