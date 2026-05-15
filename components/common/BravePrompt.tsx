"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const BravePrompt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isBrave, setIsBrave] = useState(true);

  useEffect(() => {
    const checkBrave = async () => {
      // Check if already dismissed
      const isDismissed = localStorage.getItem("brave-prompt-dismissed");
      if (isDismissed) return;

      const isBraveBrowser =
        (navigator.brave && (await navigator.brave.isBrave())) || false;

      setIsBrave(isBraveBrowser);

      if (!isBraveBrowser) {
        // Show after 1 seconds
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    };

    checkBrave();
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("brave-prompt-dismissed", "true");
  };

  if (isBrave) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 left-6 z-[300] max-w-[320px] w-full transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]",
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-12 opacity-0 pointer-events-none",
      )}
    >
      <div className="relative overflow-hidden rounded-xl bg-zinc-950/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4 flex items-center gap-4 group">
        {/* Background Glow */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 blur-[40px] rounded-full pointer-events-none" />

        {/* Logo container */}
        <div className="relative shrink-0 w-14 h-14 bg-white rounded-md p-2.5 shadow-xl transition-transform duration-500 group-hover:scale-110">
          <Image
            src="/brave-logo.png"
            alt="Brave Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-[13px] font-black text-white uppercase tracking-wider mb-0.5">
            Switch to Brave
          </h4>
          <p className="text-[11px] font-bold text-white/50 leading-relaxed line-clamp-2">
            Better experience with built-in ad blocking & redirection
            protection.
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-lg text-white/20 hover:text-white hover:bg-white/5 transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default BravePrompt;
