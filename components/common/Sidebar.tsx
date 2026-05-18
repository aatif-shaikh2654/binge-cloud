"use client";

import { cn } from "@/lib/utils";
import { Bookmark, Clock, Home, Search, Sparkles, Tv, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MdOutlineMovie } from "react-icons/md";
import SignupForm from "./SignupForm";

const sidebarItems = [
  { icon: Search, label: "Search", href: "/search" },
  { icon: Home, label: "Home", href: "/" },
  { icon: MdOutlineMovie, label: "Movies", href: "/movie" },
  { icon: Tv, label: "Web Series", href: "/tv" },
  { icon: Sparkles, label: "Anime", href: "/anime" },
  { icon: Clock, label: "History", href: "/history" },
  { icon: Bookmark, label: "Watch Later", href: "/watch-later" },
  { icon: User, label: "Account", onClick: true },
];

const mobileItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: Sparkles, label: "Anime", href: "/anime" },
  { icon: Clock, label: "History", href: "/history" },
  { icon: User, label: "Account", onClick: true },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "fixed left-0 top-0 hidden h-full flex-col py-8 lg:flex z-[100] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          isHovered
            ? "w-72 bg-sidebar/95 backdrop-blur-3xl"
            : "w-20 bg-sidebar items-center",
        )}
      >
        {/* Logo Section */}
        <div className="px-3 mb-10 w-full">
          <Link href="/" className="flex items-center gap-3 group/logo">
            <div className="relative w-14 h-14 shrink-0 transition-transform duration-500 group-hover/logo:scale-110">
              <Image
                src="/favicon/apple-touch-icon.png"
                alt="Logo"
                fill
                sizes="46px"
                className="object-contain brightness-110 drop-shadow-[0_0_10px_rgba(37,99,235,0.4)]"
              />
            </div>
            <div
              className={cn(
                "overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                isHovered ? "w-auto opacity-100 ml-0" : "w-0 opacity-0 -ml-4",
              )}
            >
              <span className="font-black text-xl tracking-tighter text-white whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                BINGE<span className="text-blue-500">CLOUD</span>
              </span>
            </div>
          </Link>
        </div>

        <div className="flex flex-col items-start justify-center gap-2 flex-1 w-full px-3">
          {sidebarItems.map((item) => {
            const isActive = item.href ? pathname === item.href : false;
            const isAccount = item.onClick;

            const triggerAction = () => {
              setIsHovered(false);
              if (isAccount) {
                setIsSignupOpen(true);
              }
            };

            if (isAccount) {
              return (
                <button
                  key={item.label}
                  onClick={triggerAction}
                  className={cn(
                    "flex items-center h-14 px-5 transition-all duration-300 relative rounded-[18px] group text-[#8197a4] hover:text-white hover:bg-white/5 cursor-pointer w-full text-left outline-none border border-transparent",
                    isHovered ? "gap-5" : "justify-center",
                  )}
                >
                  <item.icon className="w-5 h-5 transition-all duration-300 shrink-0 z-10" />

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
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href || "/"}
                onClick={triggerAction}
                className={cn(
                  "flex items-center h-14 px-5 transition-all duration-300 relative rounded-[18px] group",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-[#8197a4] hover:text-white hover:bg-white/5",
                  isHovered ? "w-full gap-5" : "justify-center",
                )}
              >
                <item.icon className="w-5 h-5 transition-all duration-300 shrink-0 z-10" />

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
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-white rounded-r-full z-20" />
                )}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full h-[70px] bg-sidebar/95 backdrop-blur-3xl border-t border-white/5 flex items-center justify-around lg:hidden z-[100] px-2">
        {mobileItems.map((item) => {
          const isActive = item.href ? pathname === item.href : false;
          const isAccount = item.onClick;

          const triggerAction = () => {
            if (isAccount) {
              setIsSignupOpen(true);
            }
          };

          if (isAccount) {
            return (
              <button
                key={item.label}
                onClick={triggerAction}
                className="flex flex-col items-center justify-center gap-1 transition-all duration-300 relative px-4 py-2 text-[#8197a4] hover:text-white/80 cursor-pointer outline-none border border-transparent"
              >
                <item.icon className="w-5 h-5 transition-all duration-300 scale-100" />
                <span className="text-[8px] font-bold uppercase tracking-wider font-sans opacity-60">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href || "/"}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all duration-300 relative px-4 py-2",
                isActive
                  ? "text-white"
                  : "text-[#8197a4] hover:text-white/80",
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

      {/* Global Signup Popup Modal */}
      {isSignupOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-300"
          onClick={() => setIsSignupOpen(false)}
        >
          <div
            className="w-full max-w-md animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <SignupForm onClose={() => setIsSignupOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
