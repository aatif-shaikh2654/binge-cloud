"use client";

/**
 * TV Feature Module — TVSidebarNav
 *
 * A large-target, D-pad-navigable sidebar rendered only when `isTVMode`.
 * Positioned fixed on the left side. Auto-hides and shows on D-pad left
 * or when focused items reach the sidebar region.
 *
 * Each nav item uses `useTVFocus` so the D-pad can navigate into / out of it.
 */

import { useTVMode } from "./TVModeContext";
import { useTVFocus } from "./useTVFocus";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  Clock,
  Film,
  Home,
  Search,
  Sparkles,
  Tv,
  Monitor,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { MdOutlineMovie } from "react-icons/md";

// ─── Nav items (mirrors Sidebar.tsx) ─────────────────────────────────────────

const TV_NAV_ITEMS = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: MdOutlineMovie, label: "Movies", href: "/movie" },
  { icon: Tv, label: "Web Series", href: "/tv" },
  { icon: Film, label: "Bollywood", href: "/bollywood" },
  { icon: Sparkles, label: "Anime", href: "/anime" },
  { icon: Clock, label: "History", href: "/history" },
  { icon: Bookmark, label: "Watch Later", href: "/watch-later" },
];

// ─── Single nav item component ────────────────────────────────────────────────

function TVNavItem({
  item,
  isActive,
  isExpanded,
}: {
  item: (typeof TV_NAV_ITEMS)[number];
  isActive: boolean;
  isExpanded: boolean;
}) {
  const router = useRouter();
  const { focusProps, isFocused } = useTVFocus({
    id: `tv-nav-${item.label}`,
    group: -1, // nav items have high priority
    onFocus: () => {
      // When nav item gains focus, reveal the sidebar
    },
  });

  const handleClick = () => {
    router.push(item.href);
  };

  const Icon = item.icon;

  return (
    <button
      {...(focusProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      ref={focusProps.ref as React.RefObject<HTMLButtonElement>}
      onClick={handleClick}
      className={cn(
        "tv-nav-btn",
        "w-full flex items-center gap-4 px-4 py-4 rounded-xl",
        "border border-transparent",
        "transition-all duration-200 ease-out",
        "focus:outline-none",
        isActive
          ? "bg-blue-600/20 border-blue-500/40 text-white"
          : "text-white/60 hover:text-white hover:bg-white/5",
        isFocused && "bg-blue-600/18 border-blue-500/50 text-white scale-[1.04]"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="shrink-0 w-7 h-7 flex items-center justify-center">
        <Icon
          className={cn(
            "w-6 h-6 transition-colors",
            isActive || isFocused ? "text-blue-400" : "text-white/50"
          )}
        />
      </span>
      <span
        className={cn(
          "text-base font-bold tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300",
          isExpanded ? "opacity-100 max-w-[160px]" : "opacity-0 max-w-0"
        )}
      >
        {item.label}
      </span>
      {isActive && (
        <span className="ml-auto w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
      )}
    </button>
  );
}

// ─── Main TV Sidebar ──────────────────────────────────────────────────────────

export function TVSidebarNav() {
  const { isTVMode, focusedId } = useTVMode();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  // Expand sidebar when a nav item inside it is focused
  useEffect(() => {
    if (!focusedId) {
      setIsExpanded(false);
      return;
    }
    const isNavFocused = focusedId.startsWith("tv-nav-");
    setIsExpanded(isNavFocused);
  }, [focusedId]);

  if (!isTVMode) return null;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full z-[200] flex flex-col py-8 transition-all duration-300 ease-in-out",
        "bg-black/80 backdrop-blur-2xl border-r border-white/5",
        isExpanded ? "w-64" : "w-20"
      )}
    >
      {/* Logo */}
      <div className="px-3 mb-10 flex items-center gap-3">
        <div className="relative w-12 h-12 shrink-0">
          <Image
            src="/favicon/apple-touch-icon.png"
            alt="Binge Cloud"
            fill
            sizes="48px"
            className="object-contain brightness-110 drop-shadow-[0_0_10px_rgba(37,99,235,0.4)]"
          />
        </div>
        <span
          className={cn(
            "font-black text-lg tracking-tighter text-white whitespace-nowrap transition-all duration-300",
            isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
          )}
        >
          BINGE<span className="text-blue-500">CLOUD</span>
        </span>
      </div>

      {/* TV label badge */}
      <div className="px-3 mb-6">
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600/15 border border-blue-500/20",
            "transition-all duration-300",
            isExpanded ? "justify-start" : "justify-center"
          )}
        >
          <Monitor className="w-4 h-4 text-blue-400 shrink-0" />
          <span
            className={cn(
              "text-[10px] font-black uppercase tracking-widest text-blue-400 whitespace-nowrap transition-all duration-300",
              isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            )}
          >
            TV Mode
          </span>
        </div>
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-1 flex-1 px-3 overflow-y-auto">
        {TV_NAV_ITEMS.map((item) => (
          <TVNavItem
            key={item.label}
            item={item}
            isActive={pathname === item.href}
            isExpanded={isExpanded}
          />
        ))}
      </div>

      {/* D-pad hint */}
      <div
        className={cn(
          "px-3 mt-4 transition-all duration-300",
          isExpanded ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest text-center leading-relaxed">
            Use D-pad to navigate
            <br />
            Press OK to select
          </p>
        </div>
      </div>
    </aside>
  );
}
