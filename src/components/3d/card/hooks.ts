import { create } from "zustand";
import { Object3D } from "three";

export const useStore = create<{
  objects: Object3D[];
  positions: Record<number, [number, number]>;
  addObject: (object: Object3D) => void;
  removeObject: (object: Object3D) => void;
  addPosition: (i: number, p: [number, number]) => void;
}>((set) => ({
  objects: [],
  positions: {},
  addObject: (object: Object3D) =>
    set((state) => ({ objects: [...state.objects, object] })),
  removeObject: (object: Object3D) =>
    set((state) => ({ objects: state.objects.filter((o) => o != object) })),
  addPosition: (i: number, p: [number, number]) =>
    set((state) => {
      state.positions[i] = p;

      return state;
    }),
}));
