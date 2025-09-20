import type { FirestoreBaseModel } from "./firestore_base_model";
import type { UserModel } from "./user_model";

export interface PaymentModel extends FirestoreBaseModel {
  documentId: string;
  violationTrackingNumber: string;
  violatorId: string;
  violatorFullName: string;
  amount: number;
  paidAt: Date;
  paidById: string;
  paidBy?: UserModel;
  paymentMethod: "Credit Card" | "Debit Card" | "Online Banking" | "Cash";
  referenceNumber: string;
}
