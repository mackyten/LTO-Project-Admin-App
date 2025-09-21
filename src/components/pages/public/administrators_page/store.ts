// src/store/counterStore.ts
import { create } from "zustand";
import type { AdministratorModel } from "../../../../models/administrator_model";

// Define the shape of your state
interface AdministratorsStore {
  pageSize: number;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  isModalOpen: boolean;
  setModalOpen: (val: boolean) => void;

  isDeleteConfirmationDialogOpen: boolean;
  setDeleteConfirmationDialog: (val: boolean) => void;

  selectedAdmin: AdministratorModel | null;
  setSelectedAdmin: (val: AdministratorModel | null) => void;
  reset: () => void;
}

// Pass the interface to the `create` function
const useAdministratorsStore = create<AdministratorsStore>((set) => ({
  pageSize: 10,
  searchQuery: "",
  setSearchQuery: (searchQuery: string) => set({ searchQuery }),
  isModalOpen: false,
  setModalOpen: (isModalOpen: boolean) => set({ isModalOpen }),

  selectedAdmin: null,
  setSelectedAdmin: (selectedAdmin: AdministratorModel | null) =>
    set({ selectedAdmin }),

  isDeleteConfirmationDialogOpen: false,
  setDeleteConfirmationDialog: (isDeleteConfirmationDialogOpen: boolean) =>
    set({ isDeleteConfirmationDialogOpen }),

  reset: () =>
    set({
      pageSize: 10,
      searchQuery: "",
      isModalOpen: false,
      selectedAdmin: null,
    }),
}));

export default useAdministratorsStore;
