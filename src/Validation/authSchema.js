import * as z from "zod";

export const signupSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters"),

  lastName: z.string().optional(),

  email: z.string().email("Please enter a valid email"),

  phoneNumber: z.string().min(10, "Please enter a valid phone number"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^a-zA-Z0-9]/, "Must contain special character"),

  terms: z.literal(true, {
    errorMap: () => ({
      message: "You must accept Terms & Conditions",
    }),
  }),
});
