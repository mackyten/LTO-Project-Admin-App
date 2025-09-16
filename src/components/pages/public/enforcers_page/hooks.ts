import { UserRoles } from "../../../../enums/roles";
import type { EnforcerModel } from "../../../../models/enforcer_model";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUsers } from "../../../../firebase/users";
import type { DocumentData } from "firebase/firestore";

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
    queryKey: ["enforcers", searchQuery],
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
