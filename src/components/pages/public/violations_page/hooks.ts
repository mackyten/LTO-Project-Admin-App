// src/hooks/useReports.ts

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { DocumentData } from "firebase/firestore";
import type { ReportModel } from "../../../../models/report_model";
import { deleteReport, getReports } from "../../../../firebase/reports";
import type { DriverModel } from "../../../../models/driver_model";
import { getDriverByPlateNumber } from "../../../../firebase/users";

interface UseReportsParams {
  pageSize: number;
  searchQuery?: string;
}

export const useReports = ({
  pageSize,
  searchQuery = "",
}: UseReportsParams) => {
  return useInfiniteQuery<{
    reports: ReportModel[];
    lastDoc: DocumentData | null;
    totalCount: number;
  }>({
    queryKey: ["reports"],
    queryFn: ({ pageParam }) =>
      getReports({
        pageSize,
        lastDoc: pageParam as DocumentData,
        searchQuery,
      }),
    getNextPageParam: (lastPage) => lastPage.lastDoc ?? undefined,
    initialPageParam: null,
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      // Invalidate the 'reports' query to force a refetch and update the UI
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error) => {
      console.error("Error deleting report: ", error);
      // Optional: Show a user-friendly error message here
    },
  });
};

export const useDriverByPlateNumber = (plateNumber: string) => {
  return useQuery<DriverModel | null, Error>({
    queryKey: ["driver", plateNumber],
    queryFn: () => getDriverByPlateNumber(plateNumber),
    enabled: !!plateNumber,
  });
};
