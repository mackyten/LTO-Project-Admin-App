import type { UserRoles } from "../enums/roles";

export interface UserModel {
  documentId: string;
  uuid: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  mobileNumber?: string;
  profilePictureUrl?: string;
  role?: UserRoles;
  queryKeys?: string[];
  isDeleted?: boolean;
  deletedAt?: string | null;
  createdAt: string;
  lastUpdatedAt: string;
  temporaryPassword?: string;
}
