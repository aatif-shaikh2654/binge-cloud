"use client";

import { PLAYER_SERVERS, type PlayerServer } from "@/app/constants/player";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Server } from "lucide-react";
import React, { useState } from "react";

interface ServerSwitcherProps {
  currentServer: PlayerServer;
  onServerChange: (server: PlayerServer) => void;
}

const ServerSwitcher: React.FC<ServerSwitcherProps> = ({
  currentServer,
  onServerChange,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "bg-black/40 backdrop-blur-md border-white/10 text-white hover:bg-white/20 h-12 px-3 rounded-xl gap-2 shadow-2xl",
        )}
      >
        <Server className="w-4 h-4 text-blue-400" />
        <span className="hidden sm:inline font-black uppercase tracking-widest text-[10px]">
          {currentServer.name}
        </span>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-sidebar/85 backdrop-blur-xl border-white/5 text-white w-full! md:w-[480px]!  p-0 flex flex-col gap-0"
      >
        <SheetHeader className="p-6 border-b border-white/5">
          <SheetTitle className="text-white text-lg font-black tracking-tight flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-500" />
            Switch Server
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="flex flex-col gap-2 p-5">
            {PLAYER_SERVERS.map((server) => (
              <button
                key={server.id}
                onClick={() => {
                  onServerChange(server);
                  setOpen(false);
                }}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 ${
                  currentServer.id === server.id
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Server
                    className={`w-4 h-4 ${currentServer.id === server.id ? "text-white" : "text-blue-500"}`}
                  />
                  <p className="text-sm font-black tracking-tight">
                    {server.name}
                  </p>
                </div>
                {currentServer.id === server.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-in zoom-in" />
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ServerSwitcher;
