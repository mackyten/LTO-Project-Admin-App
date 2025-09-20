import type { UserRoles } from "../enums/roles";
import type { FirestoreBaseModel } from "./firestore_base_model";

export interface UserModel extends FirestoreBaseModel {
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
  temporaryPassword?: string;
}
