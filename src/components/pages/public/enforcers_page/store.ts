// src/store/counterStore.ts
import { create } from "zustand";
import type { EnforcerModel } from "../../../../models/enforcer_model";

// Define the shape of your state
interface EnforcersStore {
  pageSize: number;

  searchQuery: string;
  setSearchQuery: (val: string) => void;

  openMenuId: string | null;
  setOpenMenuId: (val: string | null) => void;

  isProfileModalOpen: boolean;
  setProfileModalOpen: (val: boolean) => void;

  selectedEnforcer: EnforcerModel | undefined;
  setSelectedEnforcer: (val: EnforcerModel | undefined) => void;

  isDeleteConfirmationDialogOpen: boolean;
  setDeleteConfirmationDialog: (val: boolean) => void;

  isAddModalOpen: boolean,
  setAddModalOpen: (val: boolean) => void;

  // isDriverDialogOpen: boolean;
  // setDriverDialogOpen: (val: boolean) => void;

  reset: () => void;
}

// Pass the interface to the `create` function
const useEnforcersStore = create<EnforcersStore>((set) => ({
  pageSize: 10,
  searchQuery: "",
  setSearchQuery: (searchQuery: string) => set({ searchQuery }),
  openMenuId: null,
  setOpenMenuId: (openMenuId: string | null) => set({ openMenuId }),

  isProfileModalOpen: false,
  setProfileModalOpen: (isProfileModalOpen) => set({ isProfileModalOpen }),

  // isDriverDialogOpen: false,
  // setDriverDialogOpen: (isDriverDialogOpen) => set({ isDriverDialogOpen }),

  selectedEnforcer: undefined,
  setSelectedEnforcer: (selectedEnforcer: EnforcerModel | undefined) =>
    set({ selectedEnforcer }),

  isDeleteConfirmationDialogOpen: false,
  setDeleteConfirmationDialog: (isDeleteConfirmationDialogOpen) =>
    set({ isDeleteConfirmationDialogOpen }),

  isAddModalOpen: false,
  setAddModalOpen: (isAddModalOpen) => set({ isAddModalOpen }),

  reset: () =>
    set({
      pageSize: 10,
      searchQuery: "",
      openMenuId: null,
      /// isFullDetailDialogOpen: false,
    }),
}));

export default useEnforcersStore;
