import React from "react";
import WatchLater from "./WatchLater";

export const metadata = {
  title: "Watch Later - Binge Cloud",
  description: "Your personal watchlist of movies and series.",
};

export default function WatchLaterPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-6 lg:px-24 bg-background">
      <WatchLater />
    </main>
  );
}
