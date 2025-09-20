export interface FirestoreBaseModel {
  createdAt: Date;
  lastUpdatedAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date | null;
}
