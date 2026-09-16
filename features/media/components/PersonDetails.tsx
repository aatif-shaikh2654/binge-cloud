"use client";

import { TMDB_IMAGE_BASE_URL } from "@/features/media/constants/tmdb";
import { type TMDBPerson, type TMDBPersonCredits } from "@/features/media/types/tmdb";
import { User } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import PersonBio from "./PersonBio";
import PersonFilmography from "./PersonFilmography";
import PersonalInfo from "./PersonalInfo";
import { useQuery } from "@tanstack/react-query";
import { getPersonCredits } from "@/features/media/services/all.service";

interface PersonDetailsProps {
  person: TMDBPerson;
  credits?: TMDBPersonCredits;
}

export default function PersonDetails({ person, credits: initialCredits }: PersonDetailsProps) {
  const { data: credits, isLoading } = useQuery({
    queryKey: ["personCredits", person?.id],
    queryFn: () => getPersonCredits(person.id),
    initialData: initialCredits,
    enabled: !!person?.id,
  });
  // Compute Age
  const age = useMemo(() => {
    if (!person.birthday) return null;
    const birth = new Date(person.birthday);
    const end = person.deathday ? new Date(person.deathday) : new Date();
    let ageVal = end.getFullYear() - birth.getFullYear();
    const monthDiff = end.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
      ageVal--;
    }
    return ageVal;
  }, [person.birthday, person.deathday]);

  // Format Date
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format biography text with paragraph breaks
  const biographyParagraphs = useMemo(() => {
    if (!person.biography) return [];
    return person.biography
      .split("\n\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }, [person.biography]);

  return (
    <div className="min-h-screen bg-background text-white relative pb-20">
      {/* Blurred Backdrop Cover */}
      <div className="absolute top-0 left-0 right-0 h-[50vh] overflow-hidden pointer-events-none z-0">
        {person.profile_path && (
          <Image
            src={`${TMDB_IMAGE_BASE_URL}/original${person.profile_path}`}
            alt={person.name}
            fill
            sizes="100vw"
            className="object-cover opacity-10 blur-[100px] scale-125"
            priority
          />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/80 to-background" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-20 md:pt-36 space-y-16">
        {/* Profile Card & Bio Info */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start">
          {/* Avatar Section */}
          <div className="w-full md:w-[300px] shrink-0 flex flex-col items-start gap-6">
            <div className="relative aspect-3/4 w-64 md:w-full rounded-2xl overflow-hidden border-2 border-white/10 bg-neutral-900/50 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-500 hover:border-blue-500/50 group">
              {person.profile_path ? (
                <Image
                  src={`${TMDB_IMAGE_BASE_URL}/h632${person.profile_path}`}
                  alt={person.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-20 h-20 text-white/10" />
                </div>
              )}
            </div>
          </div>

          {/* Description & Name */}
          <div className="flex-1 space-y-8">
            <PersonBio
              name={person.name}
              biographyParagraphs={biographyParagraphs}
            />
            <PersonalInfo person={person} age={age} formatDate={formatDate} />
          </div>
        </div>

        {/* Filmography Section */}
        <PersonFilmography credits={credits} isLoading={isLoading} />
      </div>
    </div>
  );
}
