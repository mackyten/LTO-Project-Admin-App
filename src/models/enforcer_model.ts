import type { UserModel } from "./user_model";

export interface EnforcerModel extends UserModel {
  enforcerIdNumber?: string;
}
