import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "validation.emailInvalid" }),
  password: z
    .string()
    .min(8, { message: "validation.passwordMin" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, { message: "validation.nameMin" }),
    email: z.string().email({ message: "validation.emailInvalid" }),
    password: z
      .string()
      .min(8, { message: "validation.passwordMin" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "validation.passwordsDontMatch",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
