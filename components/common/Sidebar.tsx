"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Tv,
  Layers,
  Heart,
  Clock,
} from "lucide-react";
import { MdOutlineMovie } from "react-icons/md";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { icon: Search, label: "Search", href: "/search" },
  { icon: Home, label: "Home", href: "/" },
  { icon: MdOutlineMovie, label: "Movies", href: "/movies" },
  { icon: Tv, label: "Web Series", href: "/series" },
  { icon: Layers, label: "Anime", href: "/anime" },
  { icon: Layers, label: "Categories", href: "/categories" },
  { icon: Heart, label: "Wishlist", href: "/wishlist" },
  { icon: Clock, label: "History", href: "/history" },
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
                    "transition-all duration-300 flex-shrink-0 z-10",
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
                  <span className="font-black text-[14px] tracking-wide whitespace-nowrap font-sans">
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
      <nav className="fixed bottom-0 left-0 w-full h-18 bg-sidebar/95 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around lg:hidden z-[100] pb-2">
        {sidebarItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all duration-300",
                isActive ? "text-white scale-110" : "text-[#8197a4]",
              )}
            >
              <item.icon className="w-5.5 h-5.5" />
              <span className="text-[10px] font-black uppercase tracking-wider font-sans">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Sidebar;
