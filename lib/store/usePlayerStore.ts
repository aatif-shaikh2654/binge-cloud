import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlayerState {
  isMuted: boolean;
  setIsMuted: (isMuted: boolean) => void;
  toggleMuted: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      isMuted: true,
      setIsMuted: (isMuted) => set({ isMuted }),
      toggleMuted: () => set((state) => ({ isMuted: !state.isMuted })),
    }),
    {
      name: "player-settings",
    }
  )
);
