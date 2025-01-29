import { Role } from "@prisma/client";
import * as z from "zod";

const phoneRegex = new RegExp("^((\\+216-?)|0)?[0-9]{8}$");

export const SignInSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email({ message: "Email must be a valid email" }),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const SignUpSchema = z
  .object({
    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .min(3, { message: "Name must be at least 3 characters long" }),
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .email({ message: "Email must be a valid email" }),
    phone: z.string().refine((data) => phoneRegex.test(data), {
      message: "Phone number must be a valid phone number",
    }),
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string({
        required_error: "Password confirmation is required",
        invalid_type_error: "Password confirmation must be a string",
      })
      .min(8, {
        message: "Password confirmation must be at least 8 characters long",
      }),
    role: z.nativeEnum(Role),
    businessName: z.string({
      required_error: "Bussiness name is required",
      invalid_type_error: "Bussiness name must be a string",
    }),
    postalCode: z.string({
      required_error: "Postal code is required",
      invalid_type_error: "Postal code must be a string",
    }),
    taxReference: z.optional(z.string()),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "The password and confirm password fields must match.",
        path: ["confirmPassword"],
      });
    }
  })
  .refine(
    (data) => {
      if (data.role === Role.SENDER && !data.businessName) {
        return false;
      }

      return true;
    },
    {
      message: "Bussiness name is required",
      path: ["businessName"],
    },
  )
  .refine(
    (data) => {
      if (data.role === Role.SENDER && !data.postalCode) {
        return false;
      }

      return true;
    },
    {
      message: "Postal code is required",
      path: ["postalCode"],
    },
  )
  .refine(
    (data) => {
      if (data.role === Role.SENDER && !data.taxReference) {
        return false;
      }

      return true;
    },
    {
      message: "Tax reference is required",
      path: ["taxReference"],
    },
  )
  .refine(
    (data) => {
      if (data.role === Role.CARRIER && !data.businessName) {
        return false;
      }
      return true;
    },
    {
      message: "Company name is required",
      path: ["businessName"],
    },
  )
  .refine(
    (data) => {
      if (data.role === Role.CARRIER && !data.postalCode) {
        return false;
      }
      return true;
    },
    {
      message: "Postal code is required",
      path: ["postalCode"],
    },
  );

export const ForgotPasswordSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email({ message: "Email must be a valid email" }),
});

export type SignInData = z.infer<typeof SignInSchema>;
export type SignUpData = z.infer<typeof SignUpSchema>;
export type ForgotPasswordData = z.infer<typeof ForgotPasswordSchema>;
