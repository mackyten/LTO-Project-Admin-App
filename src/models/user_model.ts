import type { UserRoles } from "../enums/roles";

export interface UserModel {
  documentId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  mobileNumber?: string;
  profilePictureUrl?: string;
  role?: UserRoles;
  queryKeys?: string[];
}
