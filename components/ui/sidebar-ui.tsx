import { cn } from "@/lib/utils";
import { Bookmark, LogOut, type LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import type { IconType } from "react-icons";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "./dropdown-menu";

// --- SidebarLink component ---
interface SidebarLinkProps {
  href: string;
  icon: LucideIcon | IconType;
  label: string;
  isActive: boolean;
  isHovered: boolean;
  onClick?: () => void;
}

export function SidebarLink({
  href,
  icon: Icon,
  label,
  isActive,
  isHovered,
  onClick,
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
      <Icon className="w-5 h-5 transition-all duration-300 shrink-0 z-10" />

      {/* Text Label - Improved Animation */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isHovered ? "w-auto opacity-100 ml-0" : "w-0 opacity-0 ml-0",
        )}
      >
        <span className="font-bold text-[13px] tracking-wide whitespace-nowrap font-sans">
          {label}
        </span>
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
        className
      )}
      {...props}
    >
      <Icon className={cn("w-5 h-5 transition-all duration-300 shrink-0 z-10", iconClassName)} />
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isHovered ? "w-auto opacity-100 ml-0" : "w-0 opacity-0 ml-0",
        )}
      >
        <span className={cn("font-bold text-[13px] tracking-wide whitespace-nowrap font-sans", textClassName)}>
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
}

export function UserDropdownContent({
  email,
  onLogout,
  side,
  align,
  sideOffset,
}: UserDropdownContentProps) {
  return (
    <DropdownMenuContent
      side={side}
      align={align}
      sideOffset={sideOffset}
      className="w-64 bg-zinc-950/90 backdrop-blur-2xl border border-white/10 rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-2 flex flex-col gap-1 z-[110]"
    >
      <div className="flex flex-col px-3 py-2.5 border-b border-white/5 gap-0.5 select-none text-left">
        <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Logged In As</span>
        <span className="text-xs font-semibold text-white/90 truncate max-w-full">{email}</span>
      </div>
      <Link className="lg:hidden" href="/watch-later">
        <DropdownMenuItem
          className="flex items-center gap-2.5 w-full text-left text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 py-2.5 px-3 rounded-xl transition-all duration-300 outline-none cursor-pointer group"
        >
          <Bookmark className="size-4 transition-colors" />
          <span>Watch Later</span>
        </DropdownMenuItem>
      </Link>
      <DropdownMenuItem
        onClick={onLogout}
        className="flex items-center gap-2.5 w-full text-left text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 py-2.5 px-3 rounded-xl transition-all duration-300 outline-none cursor-pointer group"
      >
        <LogOut className="size-4 text-red-400 group-hover:text-red-300 transition-colors" />
        <span>Log Out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
