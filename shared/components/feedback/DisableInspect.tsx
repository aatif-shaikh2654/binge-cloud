"use client";

import React, { useEffect, useState } from "react";

const DisableInspect: React.FC = () => {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const isDev = process.env.NODE_ENV === "development";
  useEffect(() => {
    if (isDev) {
      return;
    }

    // 1. Disable Right-Click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Disable Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      const isAltOrOption = e.altKey;
      const isShift = e.shiftKey;

      // F12
      if (e.key === "F12") {
        e.preventDefault();
      }

      // Inspect: Ctrl+Shift+I / Cmd+Option+I
      if (
        isCmdOrCtrl &&
        (isShift || isAltOrOption) &&
        (e.code === "KeyI" || e.key === "i" || e.key === "I")
      ) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Console: Ctrl+Shift+J / Cmd+Option+J
      if (
        isCmdOrCtrl &&
        (isShift || isAltOrOption) &&
        (e.code === "KeyJ" || e.key === "j" || e.key === "J")
      ) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Element Selector: Ctrl+Shift+C / Cmd+Option+C
      if (
        isCmdOrCtrl &&
        (isShift || isAltOrOption) &&
        (e.code === "KeyC" || e.key === "c" || e.key === "C")
      ) {
        e.preventDefault();
        e.stopPropagation();
      }

      // View Source: Ctrl+U / Cmd+U / Cmd+Option+U
      if (
        isCmdOrCtrl &&
        (e.code === "KeyU" || e.key === "u" || e.key === "U")
      ) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Save Page: Ctrl+S / Cmd+S
      if (
        isCmdOrCtrl &&
        (e.code === "KeyS" || e.key === "s" || e.key === "S")
      ) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Firefox Specific (Console): Ctrl+Shift+K / Cmd+Option+K
      if (
        isCmdOrCtrl &&
        (isShift || isAltOrOption) &&
        (e.code === "KeyK" || e.key === "k" || e.key === "K")
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // 3. Advanced DevTools Detection (Debugger Loop)
    const runDebuggerCheck = () => {
      const start = performance.now();
      debugger;
      const end = performance.now();
      if (end - start > 200) {
        setIsDevToolsOpen(true);
      } else {
        setIsDevToolsOpen(false);
      }
    };

    const debuggerCheckInterval = setInterval(runDebuggerCheck, 1000);

    // Trigger immediate checks on mount
    runDebuggerCheck();

    // Add Listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(debuggerCheckInterval);
    };
  }, [isDev]);

  // 8. Body Styles and Redirect Effect
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let interval: any;
    if (isDevToolsOpen) {
      if (!isDev) {
        window.location.replace("/");
        return;
      }

      document.body.style.pointerEvents = "none";
      document.body.style.overflow = "hidden";
      // Periodically clear console to frustrate users trying to read it
      interval = setInterval(() => {
        console.clear();
      }, 500);
    } else {
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
      if (interval) clearInterval(interval);
    };
  }, [isDevToolsOpen, isDev]);

  return null;
};

export default DisableInspect;
