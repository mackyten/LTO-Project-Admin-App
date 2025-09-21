import { z } from 'zod';

export const administratorSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  middleName: z.string().optional(),
  email: z.string().email('Invalid email address').min(2, 'Email is required'),
  mobileNumber: z.string().min(2, 'Mobile number is required'),
  departmentOfficeStation: z.string().min(2, 'Department / Office / Station is required'),
  idBadgePhotoUrl: z.string().optional(),
  profilePictureUrl: z.string().optional(),
});

export type AdministratorFormData = z.infer<typeof administratorSchema>;