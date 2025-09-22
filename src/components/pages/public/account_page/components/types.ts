export interface AccountData {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  mobileNumber?: string;
  departmentOfficeStation: string;
}

export type AccountFormData = AccountData & {
  profilePicture?: File;
  idBadgePhoto?: File;
};
