import { useInfiniteQuery } from "@tanstack/react-query";
import {
  deleteAdmin,
  getAdministrators,
} from "../../../../firebase/administrators";
import { QueryDocumentSnapshot } from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import type { AdministratorModel } from "../../../../models/administrator_model";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdministrator } from "../../../../firebase/administrators";
import useAdministratorsStore from "./store";

interface GetAdministratorsResult {
  administrators: AdministratorModel[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  totalCount: number;
}

export const useAdministrators = (
  pageSize: number,
  searchQuery: string = ""
) => {
  return useInfiniteQuery<GetAdministratorsResult>({
    queryKey: ["administrators", pageSize, searchQuery],
    queryFn: async ({ pageParam }) => {
      const result = await getAdministrators({
        pageSize,
        lastDoc: pageParam ?? null,
      });
      return result;
    },
    initialPageParam: null as QueryDocumentSnapshot<DocumentData> | null,
    getNextPageParam: (lastPage) => lastPage.lastDoc,
  });
};

export const useCreateAdministrator = () => {
  const queryClient = useQueryClient();
  const { pageSize, searchQuery } = useAdministratorsStore();

  return useMutation({
    mutationFn: (
      data: Omit<
        AdministratorModel,
        "administratorID" | "documentId" | "createdAt" | "queryKeys"
      >
    ) => createAdministrator(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["administrators", pageSize, searchQuery],
      });
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  const { pageSize, searchQuery } = useAdministratorsStore();

  return useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      // Invalidate the 'administrators' query to force a refetch and update the UI
      queryClient.invalidateQueries({ queryKey: ["administrators", pageSize, searchQuery] });
    },
    onError: (error) => {
      console.error("Error deleting administrator: ", error);
      alert("Failed to delete administrator. Please try again.");
    },
  });
};
