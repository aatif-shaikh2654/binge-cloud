"use client";

import React from "react";
import Link from "next/link";
import { Home, ArrowLeft, Ghost } from "lucide-react";

const NotFound = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-background overflow-hidden px-6">
      {/* Cinematic Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-700" />
      
      <div className="relative z-10 flex flex-col items-center max-w-2xl text-center">
        {/* Animated Icon */}
        <div className="mb-8 p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl animate-in zoom-in duration-700">
          <Ghost className="w-16 h-16 text-blue-500 animate-bounce" />
        </div>

        {/* 404 Text */}
        <h1 className="text-[120px] md:text-[180px] font-black tracking-tighter leading-none mb-4 bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent select-none">
          404
        </h1>

        <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 tracking-tight">
          Oops! You&apos;ve drifted out of orbit.
        </h2>

        <p className="text-white/50 text-lg md:text-xl mb-12 leading-relaxed max-w-lg">
          The page you&apos;re looking for doesn&apos;t exist or has been moved to a 
          different sector of the cloud.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all hover:scale-[1.05] active:scale-[0.95] shadow-[0_20px_50px_rgba(37,99,235,0.3)] w-full sm:w-auto"
          >
            <Home className="w-5 h-5" />
            RETURN TO BASE
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black rounded-2xl transition-all hover:scale-[1.05] active:scale-[0.95] w-full sm:w-auto backdrop-blur-md"
          >
            <ArrowLeft className="w-5 h-5" />
            GO BACK
          </button>
        </div>
      </div>

      {/* Subtle Footer Decorative Text */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-20 select-none">
        <div className="h-px w-12 bg-white" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em]">BingeCloud Sector 404</span>
        <div className="h-px w-12 bg-white" />
      </div>
    </div>
  );
};

export default NotFound;
