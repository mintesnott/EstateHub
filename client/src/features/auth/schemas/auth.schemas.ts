import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address"),

  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
});

export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address"),

  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ message: "Current password is required" })
      .min(1, "Current password cannot be empty"),

    newPassword: z
      .string({ message: "New password is required" })
      .min(8, "New password must be at least 8 characters")
      .refine(
        (value) => /[A-Z]/.test(value) && /[0-9]/.test(value),
        "Password must contain at least one uppercase letter and one number",
      ),

    confirmPassword: z
      .string({ message: "Please confirm your new password" })
      .min(1, "Please confirm your new password"),
  })
  .refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );


export const changeEmailSchema = z.object({
  currentPassword: z
    .string({ message: "Current password is required" })
    .min(1, "Current password cannot be empty"),
  newEmail: z
    .string({message: "New Email is required"})
    .email({ message: "Invalid Email Address" })
});



export type RegisterFormInput = z.infer<typeof registerSchema>;
export type LoginFormInput = z.infer<typeof loginSchema>;
export type ChangePasswordFormInput = z.infer<typeof changePasswordSchema>;

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;