import { create } from "zustand";

export const useStore = create<{
  gameScale: number;
  changeScale: () => void;
}>((set) => ({
  gameScale: Math.min(1, window.innerWidth / 1920),
  changeScale: () =>
    set((state) => ({
      ...state,
      gameScale: Math.min(1, window.innerWidth / 1920),
    })),
}));
