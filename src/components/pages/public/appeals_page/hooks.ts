// src/hooks/useAppeals.ts

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import type { DocumentData } from "firebase/firestore";
import type { AppealsModel } from "../../../../models/appeals_model";
import type { ReportModel } from "../../../../models/report_model";
import { getAppeals, updateAppealStatus } from "../../../../firebase/apppeals";
import { getReportByTrackingNumber } from "../../../../firebase/reports";

interface UseAppealsParams {
  pageSize: number;
  searchQuery?: string;
}

export const useAppeals = ({
  pageSize,
  searchQuery = "",
}: UseAppealsParams) => {
  return useInfiniteQuery<{
    appeals: AppealsModel[];
    lastDoc: DocumentData | null;
    totalCount: number;
  }>({
    queryKey: ["appeals", searchQuery],
    queryFn: ({ pageParam }) =>
      getAppeals({
        pageSize,
        lastDoc: pageParam as DocumentData,
        searchQuery,
      }),
    getNextPageParam: (lastPage) => lastPage.lastDoc ?? undefined,
    initialPageParam: null,
  });
};

export const useUpdateAppealStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      documentId, 
      status, 
      currentUserId,
      violationTrackingNumber
    }: { 
      documentId: string; 
      status: "Approved" | "Rejected"; 
      currentUserId: string; 
      violationTrackingNumber: string;
    }) => updateAppealStatus(documentId, status, currentUserId, violationTrackingNumber),
    onSuccess: () => {
      // Invalidate the 'appeals' query to force a refetch and update the UI
      queryClient.invalidateQueries({ queryKey: ["appeals"] });
      // Also invalidate reports queries since we might update report status
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["report"] });
    },
    onError: (error) => {
      console.error("Error updating appeal status: ", error);
      // Optional: Show a user-friendly error message here
    },
  });
};

export const useReportByTrackingNumber = (violationTrackingNumber: string) => {
  return useQuery<ReportModel | null, Error>({
    queryKey: ["report", "trackingNumber", violationTrackingNumber],
    queryFn: () => getReportByTrackingNumber(violationTrackingNumber),
    enabled: !!violationTrackingNumber,
  });
};

