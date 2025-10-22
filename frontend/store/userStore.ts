import { create } from 'zustand';
import { User, TrustScoreBreakdown } from '../types';

interface UserState {
  user: User | null;
  trustBreakdown: TrustScoreBreakdown | null;
  isLoading: boolean;
  error: string | null;
  networkMode: 'mainnet' | 'testnet';
  setUser: (user: User) => void;
  setTrustBreakdown: (breakdown: TrustScoreBreakdown) => void;
  updateUserStatus: (isCitizen: boolean, trustScore: number) => void;
  setNetworkMode: (mode: 'mainnet' | 'testnet') => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  trustBreakdown: null,
  isLoading: false,
  error: null,
  networkMode: 'testnet',
  setUser: (user) => set({ user }),
  setTrustBreakdown: (breakdown) => set({ trustBreakdown: breakdown }),
  updateUserStatus: (isCitizen, trustScore) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, is_citizen: isCitizen, trust_score: trustScore }
        : null,
    })),
  setNetworkMode: (mode) => set({ networkMode: mode }),
  logout: () => set({ user: null, trustBreakdown: null }),
}));