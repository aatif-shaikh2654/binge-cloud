"use client";

import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-6 relative overflow-hidden">
      {/* Extremely subtle ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm text-center">
        <span className="text-[10px] font-black tracking-[0.5em] text-blue-500 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          Error 404
        </span>

        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Page Not Found
        </h1>

        <p className="text-white/40 text-sm font-medium mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          The page you are looking for doesn&apos;t exist or has been moved to
          another dimension.
        </p>

        <div className="flex flex-col items-center gap-6 w-full animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          <Link href="/" className="w-full">
            <Button className="w-full bg-white text-black hover:bg-blue-600 hover:text-white transition-all rounded-xl h-12 font-black uppercase tracking-widest text-[10px] shadow-[0_10px_30px_rgba(255,255,255,0.05)]">
              Return Home
            </Button>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>

      {/* Footer Badge */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-10">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
          BingeCloud Systems
        </span>
      </div>
    </div>
  );
};

export default NotFound;
