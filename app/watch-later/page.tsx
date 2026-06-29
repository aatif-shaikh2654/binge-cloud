import { getWatchlist } from "@/app/actions";
import WatchLater from "./WatchLater";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Watch Later - Binge Cloud",
  description: "Your personal watchlist of movies and series.",
};

export default async function WatchLaterPage() {
  const initialWatchlist = await getWatchlist();

  return (
    <main className="min-h-screen py-10 px-6 lg:px-20 bg-background">
      <WatchLater initialWatchlist={initialWatchlist || undefined} />
    </main>
  );
}
