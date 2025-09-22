import { create } from 'zustand';
import type { AdministratorModel } from '../../../../models/administrator_model';

interface UserState {
  currentUser: AdministratorModel | null;
  setCurrentUser: (user: AdministratorModel | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
}));
