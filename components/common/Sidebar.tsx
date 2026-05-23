"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarButton,
  SidebarLink,
  UserDropdownContent,
} from "@/components/ui/sidebar-ui";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  CircleUser,
  Clock,
  Home,
  Search,
  Sparkles,
  Tv,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MdOutlineMovie } from "react-icons/md";
import { useHistoryStore } from "@/app/store/useHistoryStore";
import { useWatchlistStore } from "@/app/store/useWatchlistStore";
import { useAuth } from "../providers/AuthProvider";
import ForgotPasswordForm from "./ForgotPasswordForm";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const sidebarItems = [
  { icon: Search, label: "Search", href: "/search" },
  { icon: Home, label: "Home", href: "/" },
  { icon: MdOutlineMovie, label: "Movies", href: "/movie" },
  { icon: Tv, label: "Web Series", href: "/tv" },
  { icon: Sparkles, label: "Anime", href: "/anime" },
  { icon: Clock, label: "History", href: "/history" },
  { icon: Bookmark, label: "Watch Later", href: "/watch-later" },
];

const mobileItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: Sparkles, label: "Anime", href: "/anime" },
  { icon: Clock, label: "History", href: "/history" },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<
    "login" | "signup" | "forgot-password"
  >("login");
  const { user, logout } = useAuth();
  const watchlistCount = useWatchlistStore((state) => state.watchlist.length);
  const historyCount = useHistoryStore((state) => state.history.length);

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

        <div className="flex flex-col items-start justify-start gap-2 flex-1 w-full px-3">
          {sidebarItems.map((item) => {
            const isActive = item.href ? pathname === item.href : false;

            const triggerAction = () => {
              setIsHovered(false);
            };

            return (
              <SidebarLink
                key={item.label}
                href={item.href || "/"}
                onClick={triggerAction}
                icon={item.icon}
                label={item.label}
                isActive={isActive}
                isHovered={isHovered}
                badgeCount={
                  item.label === "Watch Later"
                    ? watchlistCount
                    : item.label === "History"
                      ? historyCount
                      : undefined
                }
              />
            );
          })}

          {/* Bottom Account Button / Dropdown */}
          <div className="mt-auto w-full relative">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarButton
                      icon={CircleUser}
                      label={user.username || "Profile"}
                      isHovered={isHovered}
                      iconClassName="text-blue-400 animate-pulse"
                    />
                  }
                />

                <UserDropdownContent
                  email={user.email || user.username || ""}
                  onLogout={logout}
                  side="right"
                  align="end"
                  sideOffset={16}
                  watchlistCount={watchlistCount}
                />
              </DropdownMenu>
            ) : (
              <SidebarButton
                onClick={() => {
                  setAuthMode("login");
                  setIsAuthOpen(true);
                }}
                icon={CircleUser}
                label="Log In"
                isHovered={isHovered}
              />
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full h-[70px] bg-sidebar/95 backdrop-blur-3xl border-t border-white/5 flex items-center justify-around lg:hidden z-[100] px-2">
        {mobileItems.map((item) => {
          const isActive = item.href ? pathname === item.href : false;

          return (
            <Link
              key={item.label}
              href={item.href || "/"}
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

        {/* Profile item in bottom nav */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="flex flex-col items-center justify-center gap-1 relative px-4 py-2 text-blue-400 cursor-pointer outline-none transition-all duration-300">
                  <CircleUser className="w-5 h-5" />
                  <span className="text-[8px] font-bold uppercase tracking-wider font-sans opacity-100">
                    Profile
                  </span>
                </button>
              }
            />
            <UserDropdownContent
              email={user.email || user.username || ""}
              onLogout={logout}
              side="top"
              align="end"
              sideOffset={12}
              watchlistCount={watchlistCount}
            />
          </DropdownMenu>
        ) : (
          <button
            onClick={() => {
              setAuthMode("login");
              setIsAuthOpen(true);
            }}
            className="flex flex-col items-center justify-center gap-1 relative px-4 py-2 text-[#8197a4] hover:text-white/80 cursor-pointer outline-none transition-all duration-300"
          >
            <CircleUser className="w-5 h-5" />
            <span className="text-[8px] font-bold uppercase tracking-wider font-sans opacity-60">
              Log In
            </span>
          </button>
        )}
      </nav>

      {/* Global Auth Popup Modal */}
      {isAuthOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-300"
          onClick={() => setIsAuthOpen(false)}
        >
          <div
            className="w-full max-w-md animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {authMode === "login" ? (
              <LoginForm
                onClose={() => setIsAuthOpen(false)}
                onSignUpClick={() => setAuthMode("signup")}
                onForgotPasswordClick={() => setAuthMode("forgot-password")}
              />
            ) : authMode === "signup" ? (
              <SignupForm
                onClose={() => setIsAuthOpen(false)}
                onLoginClick={() => setAuthMode("login")}
              />
            ) : (
              <ForgotPasswordForm
                onClose={() => setIsAuthOpen(false)}
                onLoginClick={() => setAuthMode("login")}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
