"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PersonBioProps {
  name: string;
  biographyParagraphs: string[];
}

export default function PersonBio({
  name,
  biographyParagraphs,
}: PersonBioProps) {
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [needsReadMore, setNeedsReadMore] = useState(false);
  const bioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isBioExpanded) return;

    const checkOverflow = () => {
      if (bioRef.current) {
        setNeedsReadMore(
          bioRef.current.scrollHeight > bioRef.current.clientHeight,
        );
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [isBioExpanded, biographyParagraphs]);

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-left">
        <h1 className="text-4xl md:text-6xl lg:text-7xl leading-[130%]! font-black tracking-tighter bg-gradient-to-r from-white via-white/90 to-white/50 bg-clip-text text-transparent">
          {name}
        </h1>
      </div>

      <div className="border-t border-white/10 pt-6 space-y-4">
        <h2 className="text-xl font-extrabold tracking-tight">Biography</h2>
        {biographyParagraphs.length > 0 ? (
          <div className="space-y-4">
            <div
              ref={bioRef}
              className={`text-white/70 text-sm md:text-base leading-relaxed space-y-4 font-medium transition-all duration-500 ${
                !isBioExpanded
                  ? "line-clamp-5 overflow-hidden"
                  : "max-h-[5000px]"
              }`}
            >
              {biographyParagraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {needsReadMore && (
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
