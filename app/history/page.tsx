import React from "react";
import HistoryGrid from "./HistoryGrid";

export const metadata = {
  title: "Watch History - Binge Cloud",
  description: "Your recently watched movies and series.",
};

export default function HistoryPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-6 lg:px-24 bg-background">
      <HistoryGrid />
    </main>
  );
}
