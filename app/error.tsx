"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string; statusCode?: number; message?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  let errorMessage = "Something went wrong while fetching the data.";

  try {
    // If the error message is a JSON string from our API service
    if (error.message && error.message.startsWith("{")) {
      const parsed = JSON.parse(error.message);
      if (parsed.message) {
        errorMessage = parsed.message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e: unknown) {
    if (error.message) {
      errorMessage = error.message;
    }
  }

  // Hide ECONNRESET and timeout errors behind a friendlier message
  if (errorMessage.includes("ECONNRESET") || errorMessage.includes("timeout")) {
    errorMessage =
      "The server took too long to respond or the connection was lost. Please try again.";
  }

  return (
    <div className="h-[80vh] md:h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden px-6">
      {/* Background gradients for cinematic feel */}
      <div className="absolute inset-0 bg-linear-to-b from-red-950/20 via-background to-background pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-lg text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_40px_-10px_rgba(239,68,68,0.3)]">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Server is down
          </h1>
          <p className="text-md text-white/60 font-medium leading-relaxed">
            We are facing some technical difficulties with our server.
          </p>
        </div>

        <div className="flex flex-row text-[15px] items-center gap-4 w-full sm:w-auto pt-4">
          <Button
            onClick={() => reset()}
            variant="premium"
            size="lg"
            className="w-fit h-12  px-8 group"
          >
            <RefreshCcw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </Button>

          <Link href="/" className="w-fit">
            <Button variant="glass" size="lg" className="w-full h-12 px-8">
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
