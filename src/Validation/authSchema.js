import * as z from "zod";

export const signupSchema = z
  .object({
    firstName: z.string().min(3, "First name must be at least 3 characters"),

    lastName: z.string().optional(),

    email: z.string().email("Please enter a valid email address"),

    phoneNumber: z.string().min(10, "Please enter a valid phone number"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain uppercase letter")
      .regex(/[a-z]/, "Password must contain lowercase letter")
      .regex(/[0-9]/, "Password must contain a number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain special character"),

    confirmPassword: z.string(),

    terms: z.literal(true, {
      errorMap: () => ({
        message: "You must accept Terms and Conditions",
      }),
    }),
  })

  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),

  password: z.string().min(6, "Password is required"),
});
