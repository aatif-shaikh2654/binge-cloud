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
  const ActiveServerIcon = currentServer.icon;
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "bg-black border-white/10 text-white hover:bg-zinc-900 h-12 px-3 rounded-lg gap-2 shadow-xl hover:border-blue-500/50 transition-all",
        )}
      >
        <Server className="w-4 h-4 text-blue-400" />
        <span className="hidden sm:inline-flex items-center gap-1 font-black uppercase tracking-widest text-[10px]">
          {currentServer.name}
          {ActiveServerIcon && <ActiveServerIcon className="w-3 h-3 text-blue-400" />}
        </span>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-zinc-950 border-l border-white/10 text-white w-full! md:w-[480px]! p-0 flex flex-col gap-0"
      >
        <SheetHeader className="p-6 pb-4 border-b border-white/5 bg-gradient-to-b from-white/[0.01] to-transparent shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white text-xl font-black tracking-tighter flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-600/10 rounded-lg border border-blue-500/20">
                <Server className="w-4 h-4 text-blue-500" />
              </div>
              Switch Server
            </SheetTitle>
          </div>
          <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em] mt-1.5">
            Select a high-speed link
          </p>
        </SheetHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="flex flex-col gap-2 p-6">
            {PLAYER_SERVERS.map((server) => {
              const isActive = currentServer.id === server.id;
              const ServerIcon = server.icon;
              return (
                <button
                  key={server.id}
                  onClick={() => {
                    onServerChange(server);
                    setOpen(false);
                  }}
                  className={cn(
                    "group relative flex items-center justify-between p-3.5 rounded-lg border transition-all duration-300 active:scale-[0.98]",
                    isActive
                      ? "bg-blue-600/80 border-blue-400 text-white shadow-lg shadow-blue-600/20 backdrop-blur-sm"
                      : "bg-black border-white/5 text-white/60 hover:bg-zinc-900 hover:border-white/10 hover:text-white",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg transition-colors duration-300",
                        isActive ? "bg-white/10" : "bg-white/5 group-hover:bg-white/10",
                      )}
                    >
                      <Server
                        className={cn(
                          "w-4 h-4",
                          isActive ? "text-white" : "text-blue-500",
                        )}
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-black tracking-tight uppercase">
                          {server.name}
                        </p>
                        {server.description && (
                          <span className={cn(
                            "flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border",
                            isActive 
                              ? "bg-white/20 border-white/20 text-white" 
                              : "bg-blue-500/10 border-blue-500/20 text-blue-500"
                          )}>
                            {ServerIcon && <ServerIcon className="w-2.5 h-2.5" />}
                            {server.description}
                          </span>
                        )}
                      </div>
                      <p
                        className={cn(
                          "text-[9px] font-bold uppercase tracking-widest mt-0.5",
                          isActive ? "text-white/70" : "text-white/20",
                        )}
                      >
                        {isActive ? "Connected" : "High Speed"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/10 rounded-md border border-white/10">
                        <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                        <span className="text-[7px] font-black uppercase tracking-tighter">
                          Active
                        </span>
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-md border border-white/5 flex items-center justify-center group-hover:border-white/10 transition-all">
                        <div className="w-0.5 h-0.5 rounded-full bg-white/20 group-hover:bg-blue-500" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ServerSwitcher;
