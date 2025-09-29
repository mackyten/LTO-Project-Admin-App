import type { FirestoreBaseModel } from "./firestore_base_model";
import type { UserModel } from "./user_model";

export interface PaymentModel extends FirestoreBaseModel {
  documentId: string;
  violationTrackingNumber: string;
  violatorId: string;
  violatorFullName: string;
  amount: number;
  paidAt: Date;
  paidById: string; // uuid of the user who made the payment
  paidBy?: UserModel;
  paymentMethod: "GCASH" | "OTHERS";
  paymentId: string; // ID from the payment gateway
  status: "Pending" | "Completed" | "Failed";
}
