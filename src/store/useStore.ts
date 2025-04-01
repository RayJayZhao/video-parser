import { create } from 'zustand';

interface User {
  id: string;
  email?: string;
  phone?: string;
  points: number;
  isVIP: boolean;
  vipExpireDate?: Date;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const useStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
}));

export default useStore; 