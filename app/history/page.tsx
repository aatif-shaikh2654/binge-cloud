import { HistoryGrid } from "@/features/history";
import { getHistory } from "@/app/actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Watch History - Binge Cloud",
  description: "Your recently watched movies and series.",
};

export default async function HistoryPage() {
  const initialHistory = await getHistory();

  return (
    <main className="min-h-screen py-10 px-6 lg:px-20 bg-background">
      <HistoryGrid initialHistory={initialHistory || undefined} />
    </main>
  );
}
