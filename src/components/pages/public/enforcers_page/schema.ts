import { z } from "zod";

export const enforcerSchema = z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
    middleName: z.string().optional(),
    email: z.string().email({ message: "Invalid email address." }),
    mobileNumber: z.string().min(11, { message: "Mobile number must be at least 11 characters." }).max(11, { message: "Mobile number must be at most 11 characters." }),
    profilePicture: z.string().optional(),
    id: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    deletedAt: z.string().optional().nullable(),
});

export type EnforcerSchemaType = z.infer<typeof enforcerSchema>;