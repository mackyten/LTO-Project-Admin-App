import type { ViolationModel } from "./violation_model";

export interface ReportModel {
  documentId: string;
  fullname: string;
  address: string;
  phoneNumber: string;
  licenseNumber: string;
  licensePhoto: string;
  plateNumber: string;
  platePhoto: string;
  evidencePhoto: string;
  trackingNumber?: string | null;
  createdById?: string | null;
  violations: ViolationModel[];
  createdAt?: Date | null;
  draftId?: string | null;
  status: "Overturned" | "Submitted" | "Cancelled" | "Paid";
  paymentStatus:
    | "Pending"
    | "Completed"
    | "Refunded"
    | "Cancelled";
}
