import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { FirebaseCollections } from "../enums/collections";
import type { PaymentModel } from "../models/payment_model";

/**
 * Complete payment process by updating payment and report status
 * @param sourceId The source ID from the payment gateway
 * @returns Promise<{ success: boolean, message: string }>
 */
export const completePaymentProcess = async (
  sourceId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Step 1: Search for payment record by sourceId
    const paymentsRef = collection(db, FirebaseCollections.payments);
    const paymentQuery = query(paymentsRef, where("paymentId", "==", sourceId));
    const paymentSnapshot = await getDocs(paymentQuery);

    if (paymentSnapshot.empty) {
      return {
        success: false,
        message: "Payment record not found for the provided source ID.",
      };
    }

    // Get the first matching payment document
    const paymentDoc = paymentSnapshot.docs[0];
    const paymentData = paymentDoc.data();
    const trackingNumber = paymentData.trackingNumber;

    if (!trackingNumber) {
      return {
        success: false,
        message: "Tracking number not found in payment record.",
      };
    }

    // Step 2: Update payment status to "Completed"
    await updateDoc(paymentDoc.ref, {
      status: "Completed",
    });

    // Step 3: Search for report record by trackingNumber
    const reportsRef = collection(db, FirebaseCollections.reports);
    const reportQuery = query(
      reportsRef,
      where("trackingNumber", "==", trackingNumber)
    );
    const reportSnapshot = await getDocs(reportQuery);

    if (reportSnapshot.empty) {
      // Payment was updated but report not found
      // This is still a partial success
      return {
        success: true,
        message: "Payment completed, but associated report not found.",
      };
    }

    // Step 4: Update report status and paymentStatus
    const reportDoc = reportSnapshot.docs[0];
    await updateDoc(reportDoc.ref, {
      status: "Paid",
      paymentStatus: "Completed",
    });

    return {
      success: true,
      message: "Payment and report status updated successfully.",
    };
  } catch (error) {
    console.error("Error completing payment process:", error);
    return {
      success: false,
      message: "An error occurred while processing the payment completion.",
    };
  }
};

/**
 * Get payment details by sourceId
 * @param sourceId The source ID from the payment gateway
 * @returns Promise<any | null>
 */
export const getPaymentBySourceId = async (
  sourceId: string
): Promise<PaymentModel | null> => {
  try {
    const paymentsRef = collection(db, FirebaseCollections.payments);
    const paymentQuery = query(paymentsRef, where("sourceId", "==", sourceId));
    const paymentSnapshot = await getDocs(paymentQuery);

    if (paymentSnapshot.empty) {
      return null;
    }

    const paymentDoc = paymentSnapshot.docs[0];
    return {
      documentId: paymentDoc.id,
      ...paymentDoc.data(),
    } as PaymentModel;
  } catch (error) {
    console.error("Error fetching payment by source ID:", error);
    return null;
  }
};
