import { getTrendingMovies } from "@/app/services/all.service";
import TrendingList from "./TrendingList";

export default async function TrendingPage() {
  // Fetch first page on server
  const initialData = await getTrendingMovies(1);

  return (
    <div className="flex flex-col gap-8 pt-8 pb-12">
      <div className="px-4 lg:px-24">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-1.5 h-8 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
          <h1 className="md:text-3xl text-2xl font-black tracking-tight text-white">
            Trending Movies & Shows
          </h1>
        </div>
        <p className="text-white/40 text-xs md:text-sm font-medium max-w-3xl">
          See what the world is watching today. Our daily updated list of most
          popular content across the globe.
        </p>
      </div>

      <TrendingList initialData={initialData} />
    </div>
  );
}
