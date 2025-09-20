import { UserRoles } from "../../../../enums/roles";
import type { EnforcerModel } from "../../../../models/enforcer_model";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUsers } from "../../../../firebase/users";
import type { DocumentData } from "firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addEnforcer, deleteEnforcers } from "../../../../firebase/enforcers";
import type { EnforcerSchemaType } from "./schema";

interface UseUsersParams {
  pageSize: number;
  searchQuery?: string;
}

interface GetUsersResult {
  users: EnforcerModel[]; // Or your UserModel type
  lastDoc: DocumentData | null;
  totalCount: number;
}

export const useEnforcers = ({
  pageSize,
  searchQuery = "",
}: UseUsersParams) => {
  console.log("Searching");
  return useInfiniteQuery<GetUsersResult>({
    queryKey: ["enforcers"],
    queryFn: ({ pageParam }) =>
      getUsers({
        pageSize,
        lastDoc: pageParam as DocumentData,
        role: UserRoles.Enforcer,
        searchQuery,
      }),
    getNextPageParam: (lastPage) => lastPage.lastDoc ?? undefined,
    initialPageParam: null,
  });
};

export const useAddEnforcer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EnforcerSchemaType) => addEnforcer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enforcers"] });
    },
  });
};

export const useDeleteEnforcer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteEnforcers,
    onSuccess: () => {
      // Invalidate the 'enforcers' query to force a refetch and update the UI
      queryClient.invalidateQueries({ queryKey: ["enforcers"] });
    },
    onError: (error) => {
      console.error("Error deleting enforcer: ", error);
      alert("Failed to delete enforcer. Please try again.");
    },
  });
};
