/**
 * TV Feature Module — useTVFocus
 *
 * Per-element hook. Registers the element in the global TV focusable registry
 * and returns:
 *   - `focusProps`: spread onto the DOM element (ref + tabIndex + data attr)
 *   - `isFocused`: true when this element is the current TV focus
 *
 * On non-TV devices this hook registers nothing and `isFocused` is always false.
 */

"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTVMode } from "./TVModeContext";

interface UseTVFocusOptions {
  /** Unique ID for this focusable element */
  id: string;
  /**
   * Optional priority group — lower = higher priority.
   * Used only for initial focus selection when nothing is focused yet.
   */
  group?: number;
  /** Called when this element receives TV focus */
  onFocus?: () => void;
  /** Called when this element loses TV focus */
  onBlur?: () => void;
}

interface UseTVFocusReturn {
  /** Spread these props onto the focusable DOM element */
  focusProps: {
    ref: React.RefObject<HTMLElement | null>;
    tabIndex: number;
    "data-tv-focusable": string;
    "data-tv-focused": boolean;
    onFocus: () => void;
    onBlur: () => void;
  };
  /** Whether this element is currently the active TV focus */
  isFocused: boolean;
}

export function useTVFocus({
  id,
  group = 0,
  onFocus,
  onBlur,
}: UseTVFocusOptions): UseTVFocusReturn {
  const { isTVMode, focusedId, setFocused, register, unregister } =
    useTVMode();

  const ref = useRef<HTMLElement | null>(null);

  // Register this element in the TV navigation registry
  useEffect(() => {
    if (!isTVMode) return;
    register({ id, ref, group });
    return () => {
      unregister(id);
    };
  }, [isTVMode, id, group, register, unregister]);

  const isFocused = isTVMode && focusedId === id;

  // Sync onFocus / onBlur callbacks
  const prevFocused = useRef(isFocused);
  useEffect(() => {
    if (prevFocused.current === isFocused) return;
    prevFocused.current = isFocused;
    if (isFocused) {
      onFocus?.();
    } else {
      onBlur?.();
    }
  }, [isFocused, onFocus, onBlur]);

  const handleFocus = useCallback(() => {
    if (isTVMode) setFocused(id);
  }, [isTVMode, setFocused, id]);

  const handleBlur = useCallback(() => {
    // Don't clear focusedId on blur — TV navigation owns focus state,
    // native blur events can fire spuriously (e.g. when scrolling).
  }, []);

  return {
    focusProps: {
      ref,
      tabIndex: isTVMode ? 0 : -1,
      "data-tv-focusable": id,
      "data-tv-focused": isFocused,
      onFocus: handleFocus,
      onBlur: handleBlur,
    },
    isFocused,
  };
}
