import type { UserModel } from "./user_model";

export interface DriverModel extends UserModel {
  driverLicenseNumber?: string;
  plateNumber?: string
}
