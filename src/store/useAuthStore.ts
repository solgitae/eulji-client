import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    publicUserId: string | null;
    isInitializing: boolean;
    setUser: (user: User | null, publicUserId?: string | null) => void;
    setInitializing: (isInit: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    publicUserId: null,
    isInitializing: true,
    setUser: (user, publicUserId = null) => set({ user, publicUserId }),
    setInitializing: (isInitializing) => set({ isInitializing }),
}));
