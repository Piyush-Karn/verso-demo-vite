import { create } from 'zustand';

type AuthState = {
  user: { name: string; email: string } | null;
  signInDummy: (email: string) => void;
  signOut: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  signInDummy: (email: string) => {
    const name = email.split('@')[0] || 'Guest';
    set({ user: { name, email } });
  },
  signOut: () => set({ user: null }),
}));