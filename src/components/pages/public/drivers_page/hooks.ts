import type { DocumentData } from "firebase/firestore";
import type { DriverModel } from "../../../../models/driver_model";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUsers } from "../../../../firebase/users";
import { UserRoles } from "../../../../enums/roles";

interface UseUsersParams {
  pageSize: number;
  searchQuery?: string;
}

interface GetUsersResult {
  users: DriverModel[]; // Or your UserModel type
  lastDoc: DocumentData | null;
  totalCount: number;
}

export const useDrivers = ({
  pageSize,
  searchQuery = "",
}: UseUsersParams) => {
  console.log("Searching");
  return useInfiniteQuery<GetUsersResult>({
    queryKey: ["drivers"],
    queryFn: ({ pageParam }) =>
      getUsers({
        pageSize,
        lastDoc: pageParam as DocumentData,
        role: UserRoles.Driver,
        searchQuery,
      }),
    getNextPageParam: (lastPage) => lastPage.lastDoc ?? undefined,
    initialPageParam: null,
  });
};
