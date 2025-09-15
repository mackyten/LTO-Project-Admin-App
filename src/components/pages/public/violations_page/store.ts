// src/store/counterStore.ts
import { create } from "zustand";
import type { ReportModel } from "../../../../models/report_model";

// Define the shape of your state
interface ViolationsStore {
  pageSize: number;

  searchQuery: string;
  setSearchQuery: (val: string) => void;

  openMenuId: string | null;
  setOpenMenuId: (val: string | null) => void;

  isFullDetailDialogOpen: boolean;
  setFullDetailDialogOpen: (val: boolean) => void;

  selectedReport: ReportModel | undefined;
  setSelectedReport: (val: ReportModel | undefined) => void;

  isDeleteConfirmationDialogOpen: boolean;
  setDeleteConfirmationDialog: (val: boolean) => void;

  isDriverDialogOpen: boolean;
  setDriverDialogOpen: (val: boolean) => void;

  reset: () => void;
}

// Pass the interface to the `create` function
const useViolationsStore = create<ViolationsStore>((set) => ({
  pageSize: 10,
  searchQuery: "",
  setSearchQuery: (searchQuery: string) => set({ searchQuery }),
  openMenuId: null,
  setOpenMenuId: (openMenuId: string | null) => set({ openMenuId }),

  isFullDetailDialogOpen: false,
  setFullDetailDialogOpen: (isFullDetailDialogOpen) =>
    set({ isFullDetailDialogOpen }),

  isDriverDialogOpen: false,
  setDriverDialogOpen: (isDriverDialogOpen) => set({ isDriverDialogOpen }),

  selectedReport: undefined,
  setSelectedReport: (selectedReport: ReportModel | undefined) =>
    set({ selectedReport }),

  isDeleteConfirmationDialogOpen: false,
  setDeleteConfirmationDialog: (isDeleteConfirmationDialogOpen) =>
    set({ isDeleteConfirmationDialogOpen }),

  reset: () =>
    set({
      pageSize: 10,
      searchQuery: "",
      openMenuId: null,
      isFullDetailDialogOpen: false,
    }),
}));

export default useViolationsStore;
