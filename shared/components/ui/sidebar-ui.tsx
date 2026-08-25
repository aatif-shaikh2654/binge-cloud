import { cn } from "@/lib/utils";
import { Bookmark, Clock, Download, LogIn, LogOut, type LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import type { IconType } from "react-icons";
import { DropdownMenuContent, DropdownMenuItem } from "./dropdown-menu";

// --- SidebarLink component ---
interface SidebarLinkProps {
  href: string;
  icon: LucideIcon | IconType;
  label: string;
  isActive: boolean;
  isHovered: boolean;
  onClick?: () => void;
  badgeCount?: number;
}

export function SidebarLink({
  href,
  icon: Icon,
  label,
  isActive,
  isHovered,
  onClick,
  badgeCount,
}: SidebarLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center h-14 px-5 transition-all duration-300 relative rounded-[18px] group",
        isActive
          ? "bg-white/10 text-white"
          : "text-[#8197a4] hover:text-white hover:bg-white/5",
        isHovered ? "w-full gap-5" : "justify-center",
      )}
    >
      <div className="relative flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 transition-all duration-300 z-10" />
        {!isHovered && badgeCount !== undefined && badgeCount > 0 && (
          <div className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-blue-500 rounded-full z-20" />
        )}
      </div>

      {/* Text Label - Improved Animation */}
      <div
        className={cn(
          "flex items-center justify-between overflow-hidden transition-all duration-300 ease-in-out",
          isHovered ? "flex-1 opacity-100 ml-0" : "w-0 opacity-0 ml-0",
        )}
      >
        <span className="font-bold text-[13px] tracking-wide whitespace-nowrap font-sans">
          {label}
        </span>
        {isHovered && badgeCount !== undefined && badgeCount > 0 && (
          <span className="flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
            {badgeCount > 99 ? "99+" : badgeCount}
          </span>
        )}
      </div>

      {/* Active Indicator Bar - Discrete version */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-white rounded-r-full z-20" />
      )}
    </Link>
  );
}

// --- SidebarButton component ---
interface SidebarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon | IconType;
  label: string;
  isHovered: boolean;
  textClassName?: string;
  iconClassName?: string;
}

export function SidebarButton({
  icon: Icon,
  label,
  isHovered,
  className,
  textClassName,
  iconClassName,
  ...props
}: SidebarButtonProps) {
  return (
    <button
      className={cn(
        "flex items-center h-14 px-5 transition-all duration-300 relative rounded-[18px] group text-[#8197a4] hover:text-white hover:bg-white/5 cursor-pointer w-full text-left outline-none border border-transparent",
        isHovered ? "w-full gap-5" : "",
        className,
      )}
      {...props}
    >
      <Icon
        className={cn(
          "w-5 h-5 transition-all duration-300 shrink-0 z-10",
          iconClassName,
        )}
      />
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isHovered ? "w-auto opacity-100 ml-0" : "w-0 opacity-0 ml-0",
        )}
      >
        <span
          className={cn(
            "font-bold text-[13px] tracking-wide whitespace-nowrap font-sans",
            textClassName,
          )}
        >
          {label}
        </span>
      </div>
    </button>
  );
}

// --- UserDropdownContent component ---
interface UserDropdownContentProps {
  email: string;
  onLogout: () => void;
  side?: "bottom" | "top" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  watchlistCount?: number;
  historyCount?: number;
  onInstallClick?: () => void;
  showInstall?: boolean;
}

export function UserDropdownContent({
  email,
  onLogout,
  side,
  align,
  sideOffset,
  watchlistCount,
  historyCount,
  onInstallClick,
  showInstall,
}: UserDropdownContentProps) {
  return (
    <DropdownMenuContent
      side={side}
      align={align}
      sideOffset={sideOffset}
      className="w-64 bg-zinc-950/90 backdrop-blur-2xl border border-white/10 rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-2 flex flex-col gap-1 z-110"
    >
      <div className="flex flex-col px-3 py-2.5 border-b border-white/5 gap-0.5 select-none text-left">
        <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
          Logged In As
        </span>
        <span className="text-xs font-semibold text-white/90 truncate max-w-full">
          {email}
        </span>
      </div>
      <Link className="lg:hidden" href="/watch-later">
        <DropdownMenuItem className="flex items-center gap-2.5 w-full text-left text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 py-2.5 px-3 rounded-xl transition-all duration-300 outline-none cursor-pointer group">
          <Bookmark className="size-4 transition-colors shrink-0 text-white/60 group-hover:text-white" />
          <span className="flex-1">Watch Later</span>
          {watchlistCount !== undefined && watchlistCount > 0 && (
            <span className="flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white shrink-0">
              {watchlistCount > 99 ? "99+" : watchlistCount}
            </span>
          )}
        </DropdownMenuItem>
      </Link>
      <Link className="lg:hidden" href="/history">
        <DropdownMenuItem className="flex items-center gap-2.5 w-full text-left text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 py-2.5 px-3 rounded-xl transition-all duration-300 outline-none cursor-pointer group">
          <Clock className="size-4 transition-colors shrink-0 text-white/60 group-hover:text-white" />
          <span className="flex-1">Watch History</span>
          {historyCount !== undefined && historyCount > 0 && (
            <span className="flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white shrink-0">
              {historyCount > 99 ? "99+" : historyCount}
            </span>
          )}
        </DropdownMenuItem>
      </Link>
      {showInstall && onInstallClick && (
        <DropdownMenuItem
          onClick={onInstallClick}
          className="flex items-center gap-2.5 w-full text-left text-xs font-bold text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 py-2.5 px-3 rounded-xl transition-all duration-300 outline-none cursor-pointer group"
        >
          <Download className="size-4 text-blue-400 group-hover:text-blue-300 transition-colors shrink-0" />
          <span>Install App</span>
        </DropdownMenuItem>
      )}
      <DropdownMenuItem
        onClick={onLogout}
        className="flex items-center gap-2.5 w-full text-left text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 py-2.5 px-3 rounded-xl transition-all duration-300 outline-none cursor-pointer group"
      >
        <LogOut className="size-4 text-red-400 group-hover:text-red-300 transition-colors shrink-0" />
        <span>Log Out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

// --- LoggedOutDropdownContent component ---
interface LoggedOutDropdownContentProps {
  onLoginClick: () => void;
  side?: "bottom" | "top" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  historyCount?: number;
  watchlistCount?: number;
  onInstallClick?: () => void;
  showInstall?: boolean;
}

export function LoggedOutDropdownContent({
  onLoginClick,
  side,
  align,
  sideOffset,
  historyCount,
  watchlistCount,
  onInstallClick,
  showInstall,
}: LoggedOutDropdownContentProps) {
  return (
    <DropdownMenuContent
      side={side}
      align={align}
      sideOffset={sideOffset}
      className="w-64 bg-zinc-950/90 backdrop-blur-2xl border border-white/10 rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-2 flex flex-col gap-1 z-110"
    >
      <div className="flex flex-col px-3 py-2.5 border-b border-white/5 gap-0.5 select-none text-left">
        <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
          Welcome to BingeCloud
        </span>
        <span className="text-xs font-semibold text-white/60">
          Sign in to sync your progress
        </span>
      </div>
      <DropdownMenuItem
        onClick={onLoginClick}
        className="flex items-center gap-2.5 w-full text-left text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 py-2.5 px-3 rounded-xl transition-all duration-300 outline-none cursor-pointer group"
      >
        <LogIn className="size-4 text-white/60 group-hover:text-white transition-colors shrink-0" />
        <span>Log In / Sign Up</span>
      </DropdownMenuItem>
      {showInstall && onInstallClick && (
        <DropdownMenuItem
          onClick={onInstallClick}
          className="flex items-center gap-2.5 w-full text-left text-xs font-bold text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 py-2.5 px-3 rounded-xl transition-all duration-300 outline-none cursor-pointer group"
        >
          <Download className="size-4 text-blue-400 group-hover:text-blue-300 transition-colors shrink-0" />
          <span>Install App</span>
        </DropdownMenuItem>
      )}
      <Link className="lg:hidden" href="/watch-later">
        <DropdownMenuItem className="flex items-center gap-2.5 w-full text-left text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 py-2.5 px-3 rounded-xl transition-all duration-300 outline-none cursor-pointer group">
          <Bookmark className="size-4 transition-colors shrink-0 text-white/60 group-hover:text-white" />
          <span className="flex-1">Watch Later</span>
          {watchlistCount !== undefined && watchlistCount > 0 && (
            <span className="flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white shrink-0">
              {watchlistCount > 99 ? "99+" : watchlistCount}
            </span>
          )}
        </DropdownMenuItem>
      </Link>
      <Link className="lg:hidden" href="/history">
        <DropdownMenuItem className="flex items-center gap-2.5 w-full text-left text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 py-2.5 px-3 rounded-xl transition-all duration-300 outline-none cursor-pointer group">
          <Clock className="size-4 transition-colors shrink-0 text-white/60 group-hover:text-white" />
          <span className="flex-1">Watch History</span>
          {historyCount !== undefined && historyCount > 0 && (
            <span className="flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white shrink-0">
              {historyCount > 99 ? "99+" : historyCount}
            </span>
          )}
        </DropdownMenuItem>
      </Link>
    </DropdownMenuContent>
  );
}
