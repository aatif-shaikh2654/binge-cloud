"use client";

/**
 * TV Feature Module — TVModeContext
 *
 * Provides:
 *  - `isTVMode`: detected once on mount via UA + media query, immutable thereafter.
 *  - `focusedId`: the currently focused TV element ID.
 *  - `register` / `unregister`: focusable element registry for spatial navigation.
 *  - `setFocused`: programmatically move focus.
 *
 * This context is a zero-cost no-op on mobile/desktop (all hooks return early).
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TVFocusable {
  id: string;
  ref: React.RefObject<HTMLElement | null>;
  /** Optional priority group — lower number = higher priority for initial focus */
  group?: number;
}

interface TVModeContextValue {
  isTVMode: boolean;
  focusedId: string | null;
  setFocused: (id: string | null) => void;
  register: (item: TVFocusable) => void;
  unregister: (id: string) => void;
  getFocusables: () => TVFocusable[];
}

// ─── Detection ────────────────────────────────────────────────────────────────

/**
 * Detect whether we are running on a TV / Smart TV browser.
 *
 * Strategy: UA-string ONLY.
 * We intentionally do NOT fall back to screen-size or pointer media queries
 * because large desktop monitors (≥ 1280px) and touch laptops match those
 * same heuristics and would falsely activate TV mode.
 *
 * Covered platforms:
 *  - Android TV / Google TV (TV Bro, Chrome for TV)
 *  - Samsung Tizen (Smart TV browser)
 *  - LG WebOS
 *  - HbbTV (European broadcast TVs)
 *  - Sony BRAVIA / Netcast / Viera
 *  - Amazon Silk on Fire TV
 */
function detectTVMode(): boolean {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent;

  // Explicit TV platform UA markers
  const tvPatterns = [
    /Android.*TV/i,     // Android TV, Google TV
    /TV Safari/i,       // Generic TV Safari
    /SMART-TV/i,        // Samsung Smart TV
    /Tizen/i,           // Samsung Tizen
    /Web0S/i,           // LG WebOS
    /WebOS/i,           // LG WebOS alt spelling
    /HbbTV/i,           // Hybrid Broadcast Broadband TV (European TVs)
    /NetCast/i,         // LG NetCast
    /BRAVIA/i,          // Sony BRAVIA
    /Viera/i,           // Panasonic Viera
    /\bSilk\b.*Fire/i,  // Amazon Fire TV Silk browser
    /CrKey/i,           // Chromecast
    /Roku/i,            // Roku
  ];

  return tvPatterns.some((pattern) => pattern.test(ua));
}


// ─── Context ─────────────────────────────────────────────────────────────────

const TVModeContext = createContext<TVModeContextValue>({
  isTVMode: false,
  focusedId: null,
  setFocused: () => {},
  register: () => {},
  unregister: () => {},
  getFocusables: () => [],
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function TVModeProvider({ children }: { children: React.ReactNode }) {
  const [isTVMode, setIsTVMode] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  // Registry: Map<id, TVFocusable> — kept in a ref to avoid re-render on
  // register/unregister and to always have the latest snapshot in callbacks.
  const registryRef = useRef<Map<string, TVFocusable>>(new Map());

  // Detect TV once on mount (client-side only)
  useEffect(() => {
    const detected = detectTVMode();
    setIsTVMode(detected);

    if (detected) {
      // Brand the <html> element so tv.css can activate TV-specific styles
      document.documentElement.setAttribute("data-tv-mode", "true");
    }
  }, []);

  const setFocused = useCallback((id: string | null) => {
    setFocusedId(id);
  }, []);

  const register = useCallback((item: TVFocusable) => {
    registryRef.current.set(item.id, item);
  }, []);

  const unregister = useCallback((id: string) => {
    registryRef.current.delete(id);
  }, []);

  const getFocusables = useCallback((): TVFocusable[] => {
    return Array.from(registryRef.current.values());
  }, []);

  const value = useMemo<TVModeContextValue>(
    () => ({
      isTVMode,
      focusedId,
      setFocused,
      register,
      unregister,
      getFocusables,
    }),
    [isTVMode, focusedId, setFocused, register, unregister, getFocusables]
  );

  return (
    <TVModeContext.Provider value={value}>{children}</TVModeContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTVMode() {
  return useContext(TVModeContext);
}
