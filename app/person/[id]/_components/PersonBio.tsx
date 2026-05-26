"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface PersonBioProps {
  name: string;
  biographyParagraphs: string[];
}

export default function PersonBio({
  name,
  biographyParagraphs,
}: PersonBioProps) {
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl lg:text-7xl leading-[130%]! font-black tracking-tighter bg-gradient-to-r from-white via-white/90 to-white/50 bg-clip-text text-transparent">
          {name}
        </h1>
      </div>

      <div className="border-t border-white/10 pt-6 space-y-4">
        <h2 className="text-xl font-extrabold tracking-tight">Biography</h2>
        {biographyParagraphs.length > 0 ? (
          <div className="space-y-4">
            <div
              className={`text-white/70 text-sm md:text-base leading-relaxed space-y-4 font-medium transition-all duration-500 ${
                !isBioExpanded && biographyParagraphs.length > 3
                  ? "max-h-[250px] overflow-hidden relative"
                  : "max-h-[5000px]"
              }`}
            >
              {biographyParagraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
              {!isBioExpanded && biographyParagraphs.length > 3 && (
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
              )}
            </div>

            {biographyParagraphs.length > 3 && (
              <button
                onClick={() => setIsBioExpanded(!isBioExpanded)}
                className="flex items-center gap-1.5 text-blue-500 hover:text-blue-400 font-extrabold text-sm transition-colors cursor-pointer"
              >
                {isBioExpanded ? (
                  <>
                    Show Less <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Read Full Biography <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        ) : (
          <p className="text-white/40 italic text-sm">
            We don&apos;t have a biography for {name} yet.
          </p>
        )}
      </div>
    </div>
  );
}
