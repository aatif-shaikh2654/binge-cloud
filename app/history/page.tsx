import HistoryGrid from "./HistoryGrid";

export const metadata = {
  title: "Watch History - Binge Cloud",
  description: "Your recently watched movies and series.",
};

export default function HistoryPage() {
  return (
    <main className="min-h-screen py-10 px-6 lg:px-20 bg-background">
      <HistoryGrid />
    </main>
  );
}
