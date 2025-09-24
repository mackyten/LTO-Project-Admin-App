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
  violations: string[];
  createdAt?: Date | null;
  draftId?: string | null;
  status: "Overturned" | "Submitted" | "Cancelled";
  paymentStatus:
    | "Pending"
    | "Completed"
    | "Refunded"
    | "Cancelled";
}
