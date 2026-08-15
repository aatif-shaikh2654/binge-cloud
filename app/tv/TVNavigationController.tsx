/**
 * TV Feature Module — TVNavigationController
 *
 * Client component dropped once into layout.tsx that activates the D-pad
 * keyboard listener. Renders nothing — purely a side-effect component.
 */

"use client";

import { useTVNavigation } from "./useTVNavigation";

export function TVNavigationController() {
  useTVNavigation();
  return null;
}
