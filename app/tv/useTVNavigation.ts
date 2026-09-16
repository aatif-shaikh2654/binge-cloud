/**
 * TV Feature Module — useTVNavigation
 *
 * Spatial D-pad navigation hook. Listens for arrow key / remote control events
 * and moves focus to the nearest registered element in the given direction.
 *
 * Algorithm: For each direction, filter elements whose bounding rect is
 * strictly "ahead" in that direction, then pick the one with the smallest
 * center-to-center Euclidean distance.
 *
 * Only active when `isTVMode === true`. Zero cost on desktop / mobile.
 */

"use client";

import { useEffect } from "react";
import type { TVFocusable } from "./TVModeContext";
import { useTVMode } from "./TVModeContext";

// ─── Direction types ──────────────────────────────────────────────────────────

type Direction = "up" | "down" | "left" | "right";

// ─── Geometry helpers ─────────────────────────────────────────────────────────

function centerOf(rect: DOMRect) {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function distance(
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/**
 * Returns true if `candidate` is in the given direction relative to `current`.
 * We add a small overlap tolerance (4 px) to account for sub-pixel rendering.
 */
function isInDirection(
  current: DOMRect,
  candidate: DOMRect,
  direction: Direction,
): boolean {
  const TOLERANCE = 4;
  switch (direction) {
    case "right":
      return candidate.left >= current.right - TOLERANCE;
    case "left":
      return candidate.right <= current.left + TOLERANCE;
    case "down":
      return candidate.top >= current.bottom - TOLERANCE;
    case "up":
      return candidate.bottom <= current.top + TOLERANCE;
  }
}

// ─── Navigation resolver ──────────────────────────────────────────────────────

function findNearest(
  focusedEl: HTMLElement,
  candidates: TVFocusable[],
  direction: Direction,
): TVFocusable | null {
  const currentRect = focusedEl.getBoundingClientRect();
  const currentCenter = centerOf(currentRect);

  let best: TVFocusable | null = null;
  let bestDist = Infinity;

  for (const candidate of candidates) {
    const el = candidate.ref.current;
    if (!el || el === focusedEl) continue;

    const rect = el.getBoundingClientRect();

    // Skip invisible elements
    if (rect.width === 0 || rect.height === 0) continue;

    if (!isInDirection(currentRect, rect, direction)) continue;

    const d = distance(currentCenter, centerOf(rect));
    if (d < bestDist) {
      bestDist = d;
      best = candidate;
    }
  }

  return best;
}

// ─── Key → Direction map ──────────────────────────────────────────────────────

const KEY_DIRECTION_MAP: Record<string, Direction> = {
  ArrowUp: "up",
  Up: "up",
  ArrowDown: "down",
  Down: "down",
  ArrowLeft: "left",
  Left: "left",
  ArrowRight: "right",
  Right: "right",
};

const getDirectionFromEvent = (e: KeyboardEvent): Direction | null => {
  if (KEY_DIRECTION_MAP[e.key]) return KEY_DIRECTION_MAP[e.key];
  // Remote D-pad keyCodes: 19 (Up), 20 (Down), 21 (Left), 22 (Right)
  if (e.keyCode === 19 || e.which === 19) return "up";
  if (e.keyCode === 20 || e.which === 20) return "down";
  if (e.keyCode === 21 || e.which === 21) return "left";
  if (e.keyCode === 22 || e.which === 22) return "right";
  return null;
};

const isSelectKey = (e: KeyboardEvent): boolean => {
  return (
    e.key === "Enter" ||
    e.key === "Return" ||
    e.key === "Select" ||
    e.key === "Ok" ||
    e.keyCode === 13 ||
    e.which === 13
  );
};

const isBackKey = (e: KeyboardEvent): boolean => {
  return (
    e.key === "Escape" ||
    e.key === "Backspace" ||
    e.key === "GoBack" ||
    e.keyCode === 27 ||
    e.keyCode === 8 ||
    e.keyCode === 10009 || // Samsung Tizen Return
    e.keyCode === 461 // LG WebOS Back
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTVNavigation() {
  const { isTVMode, focusedId, setFocused, getFocusables } = useTVMode();

  useEffect(() => {
    if (!isTVMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const direction = getDirectionFromEvent(e);

      // ── Arrow key / D-pad navigation ────────────────────────────────────────
      if (direction) {
        e.preventDefault();

        const focusables = getFocusables();
        if (focusables.length === 0) return;

        // Sort candidates by priority group if initial focus
        const sortedFocusables = [...focusables].sort(
          (a, b) => (a.group ?? 0) - (b.group ?? 0),
        );

        // If nothing is focused yet or current focused item is unmounted
        const currentItem = focusedId
          ? focusables.find((f) => f.id === focusedId)
          : null;
        const currentEl = currentItem?.ref.current;

        if (!currentEl) {
          const first = sortedFocusables[0];
          if (first?.ref.current) {
            setFocused(first.id);
            first.ref.current.focus({ preventScroll: false });
            first.ref.current.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "nearest",
            });
          }
          return;
        }

        const next = findNearest(currentEl, focusables, direction);
        if (next && next.ref.current) {
          setFocused(next.id);
          next.ref.current.focus({ preventScroll: false });
          // Scroll focused element into view smoothly
          next.ref.current.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
          });
        }
        return;
      }

      // ── Enter / OK — click the focused element ──────────────────────────────
      if (isSelectKey(e)) {
        if (!focusedId) return;
        const focusables = getFocusables();
        const item = focusables.find((f) => f.id === focusedId);
        if (item?.ref.current) {
          e.preventDefault();
          item.ref.current.click();
        }
        return;
      }

      // ── Back / Escape — blur current focus ─────────────────────────────────
      if (isBackKey(e)) {
        setFocused(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [isTVMode, focusedId, getFocusables, setFocused]);
}
