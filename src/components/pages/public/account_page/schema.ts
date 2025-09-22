import { z } from 'zod';

export const accountSchema = z.object({
  firstName: z.string().nonempty('First name is required'),
  lastName: z.string().nonempty('Last name is required'),
  middleName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  mobileNumber: z.string().optional(),
  departmentOfficeStation: z.string().nonempty('Department/Office/Station is required'),
});