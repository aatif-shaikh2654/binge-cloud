"use client";

import { cn } from "@/lib/utils";
import { Bookmark, Clock, Home, Layers, Search, Tv } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MdOutlineMovie } from "react-icons/md";

const sidebarItems = [
  { icon: Search, label: "Search", href: "/search" },
  { icon: Home, label: "Home", href: "/" },
  { icon: MdOutlineMovie, label: "Movies", href: "/movie" },
  { icon: Tv, label: "Web Series", href: "/tv" },
  { icon: Layers, label: "Anime", href: "/anime" },
  { icon: Clock, label: "History", href: "/history" },
  { icon: Bookmark, label: "Watch Later", href: "/watch-later" },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "fixed left-0 top-0 hidden h-full flex-col py-10 lg:flex z-[100] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          isHovered
            ? "w-72 bg-sidebar/95 backdrop-blur-3xl"
            : "w-20 bg-sidebar items-center",
        )}
      >
        <div className="flex flex-col items-start justify-center gap-2 flex-1 w-full px-3">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => {
                  setIsHovered(false);
                }}
                className={cn(
                  "flex items-center h-14 px-5 transition-all duration-300 relative rounded-[18px] group",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-[#8197a4] hover:text-white hover:bg-white/5",
                  isHovered ? "w-full gap-5" : "justify-center",
                )}
              >
                <item.icon
                  className={cn(
                    "transition-all duration-300 shrink-0 z-10",
                    isActive ? "w-5 h-5" : "w-5 h-5",
                  )}
                />

                {/* Text Label - Improved Animation */}
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isHovered
                      ? "w-auto opacity-100 ml-0"
                      : "w-0 opacity-0 ml-0",
                  )}
                >
                  <span className="font-bold text-[13px] tracking-wide whitespace-nowrap font-sans">
                    {item.label}
                  </span>
                </div>

                {/* Active Indicator Bar - Discrete version */}
                {isActive && !isHovered && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-white rounded-r-full z-20" />
                )}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full h-[70px] bg-sidebar/95 backdrop-blur-3xl border-t border-white/5 flex items-center justify-around lg:hidden z-100 px-2">
        {sidebarItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all duration-300 relative px-4 py-2",
                isActive ? "text-white" : "text-[#8197a4] hover:text-white/80",
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 transition-all duration-300",
                  isActive ? "scale-110" : "scale-100",
                )}
              />
              <span
                className={cn(
                  "text-[8px] font-bold uppercase tracking-wider font-sans transition-all duration-300",
                  isActive ? "opacity-100" : "opacity-60",
                )}
              >
                {item.label}
              </span>

              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Sidebar;
