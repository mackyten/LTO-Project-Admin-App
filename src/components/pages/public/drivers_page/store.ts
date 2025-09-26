// src/store/counterStore.ts
import { create } from "zustand";
import type { DriverModel } from "../../../../models/driver_model";

// Define the shape of your state
interface DriversStore {
  pageSize: number;

  searchQuery: string;
  setSearchQuery: (val: string) => void;

  openMenuId: string | null;
  setOpenMenuId: (val: string | null) => void;

  isProfileModalOpen: boolean;
  setProfileModalOpen: (val: boolean) => void;

  selectedDriver: DriverModel | undefined;
  setSelectedDriver: (val: DriverModel | undefined) => void;

  isAddModalOpen: boolean,
  setAddModalOpen: (val: boolean) => void;

  // isDriverDialogOpen: boolean;
  // setDriverDialogOpen: (val: boolean) => void;

  reset: () => void;
}

// Pass the interface to the `create` function
const useDriversStore = create<DriversStore>((set) => ({
  pageSize: 10,
  searchQuery: "",
  setSearchQuery: (searchQuery: string) => set({ searchQuery }),
  openMenuId: null,
  setOpenMenuId: (openMenuId: string | null) => set({ openMenuId }),

  isProfileModalOpen: false,
  setProfileModalOpen: (isProfileModalOpen) => set({ isProfileModalOpen }),

  selectedDriver: undefined,
  setSelectedDriver: (selectedDriver: DriverModel | undefined) =>
    set({ selectedDriver }),

  isAddModalOpen: false,
  setAddModalOpen: (isAddModalOpen) => set({ isAddModalOpen }),

  reset: () =>
    set({
      pageSize: 10,
      searchQuery: "",
      openMenuId: null,
      isProfileModalOpen: false,
      selectedDriver: undefined,
      isAddModalOpen: false,
    }),
}));

export default useDriversStore;
