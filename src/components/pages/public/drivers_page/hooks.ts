import type { DocumentData } from "firebase/firestore";
import type { DriverModel } from "../../../../models/driver_model";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers } from "../../../../firebase/users";
import { UserRoles } from "../../../../enums/roles";
import { updateDriver, type UpdateDriverData } from "../../../../firebase/drivers";

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

export const useUpdateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId, driverData }: { documentId: string; driverData: UpdateDriverData }) =>
      updateDriver({ documentId, driverData }),
    onSuccess: () => {
      // Invalidate the 'drivers' query to force a refetch and update the UI
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
    onError: (error) => {
      console.error("Error updating driver: ", error);
    },
  });
};
