import type { UserModel } from "./user_model";

export interface AdministratorModel extends UserModel {
  administratorID?: string;
  departmentOfficeStation?: string;
  idBadgePhotoUrl?: string;
}
    