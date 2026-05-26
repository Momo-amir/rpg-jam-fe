import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Required"),
});

export const registerSchema = z
  .object({
    username: z.string().min(3, "At least 3 character").max(32),
    email: z.email("Enter a valid email"),
    password: z
      .string()
      .min(8, "Make sure your password is atleast 8 characters*"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
