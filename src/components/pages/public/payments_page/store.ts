// src/store/counterStore.ts
import { create } from "zustand";

// Define the shape of your state
interface PaymentsStore {
  pageSize: number;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  reset: () => void;
}

// Pass the interface to the `create` function
const usePaymentsStore = create<PaymentsStore>((set) => ({
  pageSize: 10,
  searchQuery: "",
  setSearchQuery: (searchQuery: string) => set({ searchQuery }),

  reset: () =>
    set({
      pageSize: 10,
      searchQuery: "",
    }),
}));

export default usePaymentsStore;
