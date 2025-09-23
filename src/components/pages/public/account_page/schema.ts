import { z } from 'zod';

export const accountSchema = z.object({
  firstName: z.string().nonempty('First name is required'),
  lastName: z.string().nonempty('Last name is required'),
  middleName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  mobileNumber: z.string().optional(),
  departmentOfficeStation: z.string().nonempty('Department/Office/Station is required'),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().nonempty('Current password is required'),
  newPassword: z
    .string()
    .min(6, 'New password must be at least 6 characters long')
    .nonempty('New password is required'),
  confirmPassword: z.string().nonempty('Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;