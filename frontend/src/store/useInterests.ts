import { create } from 'zustand';

export type InterestItem = {
  id: string;
  title: string;
  type: 'activity' | 'cafe';
  country: string;
  city: string;
  image_base64?: string | null;
  cost_indicator?: '$' | '$$' | '$$$' | null;
};

type InterestsState = {
  items: InterestItem[];
  add: (it: InterestItem) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useInterests = create<InterestsState>((set, get) => ({
  items: [],
  add: (it) => set({ items: [...get().items.filter((x) => x.id !== it.id), it] }),
  remove: (id) => set({ items: get().items.filter((x) => x.id !== id) }),
  clear: () => set({ items: [] }),
}));