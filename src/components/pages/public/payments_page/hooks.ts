import { useInfiniteQuery } from "@tanstack/react-query";
import type { DocumentData } from "firebase/firestore";
import type { PaymentModel } from "../../../../models/payment_model";
import { getPayments } from "../../../../firebase/payments";

interface UsePaymentsParams {
  pageSize: number;
  searchQuery?: string;
}

interface GetPaymentsResult {
  payments: PaymentModel[];
  lastDoc: DocumentData | null;
  totalCount: number;
}

export const usePayments = ({
  pageSize,
  searchQuery = "",
}: UsePaymentsParams) => {
  console.log("Searching");
  return useInfiniteQuery<GetPaymentsResult>({
    queryKey: ["payments"],
    queryFn: ({ pageParam }) =>
      getPayments({
        pageSize,
        lastDoc: pageParam as DocumentData,
        searchQuery,
      }),
    getNextPageParam: (lastPage) => lastPage.lastDoc ?? undefined,
    initialPageParam: null,
  });
};



// export const useDeleteEnforcer = () => {
//   const queryClient = useQueryClient();
  
//   return useMutation({
//     mutationFn: deleteEnforcers,
//     onSuccess: () => {
//       // Invalidate the 'enforcers' query to force a refetch and update the UI
//       queryClient.invalidateQueries({ queryKey: ["enforcers"] });
//     },
//     onError: (error) => {
//       console.error("Error deleting enforcer: ", error);
//       alert("Failed to delete enforcer. Please try again.");
//     },
//   });
// };
