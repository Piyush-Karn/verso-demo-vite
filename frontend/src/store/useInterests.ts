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
  toggle: (it: InterestItem) => void;
  has: (id: string) => boolean;
  clear: () => void;
};

export const useInterests = create<InterestsState>((set, get) => ({
  items: [],
  add: (it) => set({ items: [...get().items.filter((x) => x.id !== it.id), it] }),
  remove: (id) => set({ items: get().items.filter((x) => x.id !== id) }),
  toggle: (it) => {
    const exists = get().items.some((x) => x.id === it.id);
    if (exists) set({ items: get().items.filter((x) => x.id !== it.id) });
    else set({ items: [...get().items, it] });
  },
  has: (id) => get().items.some((x) => x.id === id),
  clear: () => set({ items: [] }),
}));