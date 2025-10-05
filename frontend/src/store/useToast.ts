import { create } from 'zustand';

export type Toast = { id: string; message: string };

type ToastState = {
  toasts: Toast[];
  show: (message: string) => void;
  remove: (id: string) => void;
};

export const useToast = create<ToastState>((set, get) => ({
  toasts: [],
  show: (message: string) => {
    const id = Math.random().toString(36).slice(2);
    set({ toasts: [...get().toasts, { id, message }] });
    setTimeout(() => get().remove(id), 2000);
  },
  remove: (id: string) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));