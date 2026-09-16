import { getPersonDetails } from "@/features/media/services/all.service";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PersonDetails } from "@/features/media";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const person = await getPersonDetails(id);
    if (!person) return { title: "Cast Details" };

    const description = person.biography
      ? person.biography.slice(0, 160) + "..."
      : `Explore movies and series done by ${person.name} on Binge Cloud.`;

    const imageUrl = person.profile_path
      ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
      : undefined;

    return {
      title: `${person.name} - Cast Details`,
      description,
      openGraph: imageUrl
        ? {
            images: [imageUrl],
          }
        : undefined,
    };
  } catch {
    return { title: "Cast Details" };
  }
}

export default async function PersonPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) notFound();

  let person;
  try {
    person = await getPersonDetails(id);
  } catch (error) {
    console.error("Error loading person page details:", error);
    notFound();
  }

  if (!person) {
    notFound();
  }

  return <PersonDetails person={person} />;
}
