import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface GenreBadgeProps {
  name: string;
  href?: string;
  className?: string;
}

export const GenreBadge: React.FC<GenreBadgeProps> = ({
  name,
  href,
  className,
}) => {
  const baseStyle =
    "inline-flex items-center justify-center uppercase text-[9px] lg:text-[10px] font-black tracking-wider px-2 py-0.5 rounded transition-all duration-300 select-none";

  const normalStyle =
    "border border-white/15 text-white/70 bg-white/[0.03] backdrop-blur-xs shadow-xs";

  const interactiveStyle =
    "hover:bg-white hover:text-black hover:border-white hover:scale-105 active:scale-95 hover:shadow-[0_0_12px_rgba(255,255,255,0.35)] cursor-pointer";

  if (href) {
    return (
      <Link
        href={href}
        className={cn(baseStyle, normalStyle, interactiveStyle, className)}
      >
        {name}
      </Link>
    );
  }

  return (
    <span className={cn(baseStyle, normalStyle, className)}>
      {name}
    </span>
  );
};

export default GenreBadge;
