import { create } from 'zustand';
import type { UserModel } from '../../../../models/user_model';

interface UserState {
  currentUser: UserModel | null;
  setCurrentUser: (user: UserModel | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
}));
