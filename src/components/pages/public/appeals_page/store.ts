// src/store/appealsStore.ts
import { create } from "zustand";
import type { AppealsModel } from "../../../../models/appeals_model";

// Define the shape of your state
interface AppealsStore {
  pageSize: number;
  searchQuery: string;
  selectedAppeal: AppealsModel | undefined;
  isAppealDetailsDialogOpen: boolean;
  
  setSearchQuery: (val: string) => void;
  setSelectedAppeal: (appeal: AppealsModel | undefined) => void;
  setAppealDetailsDialogOpen: (open: boolean) => void;
  reset: () => void;
}

// Pass the interface to the `create` function
const useAppealsStore = create<AppealsStore>((set) => ({
  pageSize: 10,
  searchQuery: "",
  selectedAppeal: undefined,
  isAppealDetailsDialogOpen: false,
  
  setSearchQuery: (searchQuery: string) => set({ searchQuery }),
  setSelectedAppeal: (selectedAppeal: AppealsModel | undefined) => set({ selectedAppeal }),
  setAppealDetailsDialogOpen: (isAppealDetailsDialogOpen: boolean) => set({ isAppealDetailsDialogOpen }),

  reset: () =>
    set({
      pageSize: 10,
      searchQuery: "",
      selectedAppeal: undefined,
      isAppealDetailsDialogOpen: false,
    }),
}));

export default useAppealsStore;
