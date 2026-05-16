import WatchLater from "./WatchLater";

export const metadata = {
  title: "Watch Later - Binge Cloud",
  description: "Your personal watchlist of movies and series.",
};

export default function WatchLaterPage() {
  return (
    <main className="min-h-screen py-10 px-6 lg:px-20 bg-background">
      <WatchLater />
    </main>
  );
}
