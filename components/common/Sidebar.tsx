"use client";

import { usePWAInstall } from "@/app/hooks/usePWAInstall";
import { useHistoryStore } from "@/app/store/useHistoryStore";
import { useWatchlistStore } from "@/app/store/useWatchlistStore";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LoggedOutDropdownContent,
  SidebarButton,
  SidebarLink,
  UserDropdownContent,
} from "@/components/ui/sidebar-ui";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  CircleUser,
  Clock,
  Film,
  Home,
  Search,
  Sparkles,
  Tv,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MdOutlineMovie } from "react-icons/md";
import { useAuth } from "../providers/AuthProvider";
import ForgotPasswordForm from "./ForgotPasswordForm";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const sidebarItems = [
  { icon: Search, label: "Search", href: "/search" },
  { icon: Home, label: "Home", href: "/" },
  { icon: MdOutlineMovie, label: "Movies", href: "/movie" },
  { icon: Tv, label: "Web Series", href: "/tv" },
  { icon: Film, label: "Bollywood", href: "/bollywood" },
  { icon: Sparkles, label: "Anime", href: "/anime" },
  { icon: Clock, label: "History", href: "/history" },
  { icon: Bookmark, label: "Watch Later", href: "/watch-later" },
];

const mobileItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: Film, label: "Bollywood", href: "/bollywood" },
  { icon: Sparkles, label: "Anime", href: "/anime" },
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

  const { isInstallable, isStandalone, isIOS, install } = usePWAInstall();
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true); // default to true to avoid hydration mismatch

  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      setIsDismissed(dismissed === "true");
    }
  }, []);

  const showInstallOption = isInstallable || (isIOS && !isStandalone);

  const handleDismissPopup = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pwa-install-dismissed", "true");
    }
    setIsDismissed(true);
  };

  const handleInstall = async () => {
    if (isIOS) {
      handleDismissPopup(); // dismiss banner before showing iOS sheet
      setShowIOSPrompt(true);
    } else {
      await install();
      handleDismissPopup(); // hide banner after native prompt resolves
    }
  };

  const showPopup = showInstallOption && !isDismissed;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "fixed left-0 top-0 hidden h-full flex-col py-8 lg:flex z-100 transition-all duration-300 ease-in-out",
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
                "overflow-hidden transition-all duration-500 ease-in-out",
                isHovered ? "w-auto opacity-100 ml-0" : "w-0 opacity-0 -ml-4",
              )}
            >
              <span className="font-black text-xl tracking-tighter text-white whitespace-nowrap bg-clip-text bg-linear-to-r from-white to-white/70">
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
                  showInstall={showPopup}
                  onInstallClick={handleInstall}
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
      <nav className="fixed bottom-0 left-0 w-full h-[70px] bg-sidebar/95 backdrop-blur-3xl border-t border-white/5 flex items-center justify-around lg:hidden z-100 px-2">
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
              <div className="relative">
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isActive ? "scale-110" : "scale-100",
                  )}
                />
                {item.label === "History" && historyCount > 0 && (
                  <div className="absolute -top-1.5 -right-2 bg-blue-600 text-white text-[8px] font-black px-1 min-w-[14px] h-[14px] rounded-full flex items-center justify-center border border-black shadow-sm">
                    {historyCount > 99 ? "99+" : historyCount}
                  </div>
                )}
              </div>
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
              historyCount={historyCount}
              showInstall={showPopup}
              onInstallClick={handleInstall}
            />
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="flex flex-col items-center justify-center gap-1 relative px-4 py-2 text-[#8197a4] hover:text-white/80 cursor-pointer outline-none transition-all duration-300">
                  <CircleUser className="w-5 h-5" />
                  <span className="text-[8px] font-bold uppercase tracking-wider font-sans opacity-60">
                    Log In
                  </span>
                </button>
              }
            />
            <LoggedOutDropdownContent
              onLoginClick={() => {
                setAuthMode("login");
                setIsAuthOpen(true);
              }}
              side="top"
              align="end"
              sideOffset={12}
              historyCount={historyCount}
              watchlistCount={watchlistCount}
              showInstall={showPopup}
              onInstallClick={handleInstall}
            />
          </DropdownMenu>
        )}
      </nav>

      {/* iOS Install Prompt Modal */}
      {showIOSPrompt && (
        <div
          className="fixed inset-0 z-999 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-300"
          onClick={() => setShowIOSPrompt(false)}
        >
          <div
            className="w-full max-w-sm bg-zinc-950/95 border border-white/10 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-6 flex flex-col gap-5 text-center animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <span className="font-extrabold text-xs uppercase tracking-wider text-blue-400">
                Install Binge Cloud
              </span>
              <button
                onClick={() => setShowIOSPrompt(false)}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="flex flex-col items-center gap-4 py-2">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg border border-white/10 shrink-0">
                <Image
                  src="/favicon/apple-touch-icon.png"
                  alt="Binge Cloud Logo"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <p className="text-zinc-300 text-sm font-semibold leading-relaxed">
                Add Binge Cloud to your home screen for a full-screen, premium
                cinematic experience.
              </p>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col gap-3 text-left">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center size-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold shrink-0 mt-0.5">
                  1
                </span>
                <p className="text-xs text-zinc-300 font-medium">
                  Tap the share button{" "}
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/10 text-white font-bold font-sans">
                    ⎋
                  </span>{" "}
                  (at the bottom or top of Safari).
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center size-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold shrink-0 mt-0.5">
                  2
                </span>
                <p className="text-xs text-zinc-300 font-medium">
                  Scroll down and tap{" "}
                  <span className="text-white font-bold">
                    "Add to Home Screen"
                  </span>{" "}
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/10 text-white font-bold font-sans">
                    ➕
                  </span>
                  .
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSPrompt(false)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.4)] cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* PWA Install Promo Top-Right Popup */}
      {showPopup && (
        <div className="fixed top-4 left-4 right-4 sm:top-6 sm:right-6 sm:left-auto z-[99] w-auto sm:w-80 bg-zinc-950/90 backdrop-blur-2xl border border-white/10 hover:border-blue-500/20 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-5 flex flex-col gap-4 transition-all duration-500 animate-in slide-in-from-top-6 fade-in duration-500">
          {/* Header row: App Logo & Close Button */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              {/* App Icon matching sidebar logo style */}
              <div className="relative w-12 h-12 shrink-0">
                <Image
                  src="/favicon/apple-touch-icon.png"
                  alt="Binge Cloud"
                  fill
                  sizes="48px"
                  className="object-contain rounded-xl brightness-110 drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                />
              </div>
              <div className="text-left">
                <h4 className="font-extrabold text-sm text-white tracking-wide">
                  Install Binge Cloud
                </h4>
                <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
                  Get full-screen cinematic streaming
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleDismissPopup}
              className="text-zinc-500 hover:text-zinc-200 transition-colors p-1.5 rounded-full hover:bg-white/5 cursor-pointer outline-none border border-transparent"
              aria-label="Dismiss install prompt"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDismissPopup}
              className="flex-1 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all duration-300 text-center cursor-pointer border border-white/5 hover:border-white/10"
            >
              Later
            </button>
            <button
              onClick={handleInstall}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black py-2.5 px-4 rounded-xl transition-all duration-300 text-center cursor-pointer shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.55)] active:scale-95"
            >
              Install Now
            </button>
          </div>
        </div>
      )}

      {/* Global Auth Popup Modal */}
      {isAuthOpen && (
        <div
          className="fixed inset-0 z-999 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-300"
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
