import { getTrendingMovies } from "@/app/services/all.service";
import PageHeader from "@/components/common/PageHeader";
import type { Metadata } from "next";
import TrendingList from "./TrendingList";

export const metadata: Metadata = {
  title: "Trending",
  description:
    "See what the world is watching today. Our daily updated list of most popular content across the globe.",
};

export const dynamic = "force-dynamic";

export default async function TrendingPage() {
  // Fetch first page on server
  const initialData = await getTrendingMovies(1);

  return (
    <div className="flex flex-col gap-8 pt-8 pb-12">
      <PageHeader
        title="Trending Movies & Shows"
        description="See what the world is watching today. Our daily updated list of most popular content across the globe."
      />

      <TrendingList initialData={initialData} />
    </div>
  );
}
