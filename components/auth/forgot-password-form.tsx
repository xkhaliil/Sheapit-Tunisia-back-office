"use client";

import React from "react";

import Link from "next/link";
import { ForgotPasswordData, ForgotPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm() {
  const forgotPasswordForm = useForm<ForgotPasswordData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Forgot your password?
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the email address associated with your account. We&apos;ll you a
          link to reset your password.
        </p>
      </div>

      <Form {...forgotPasswordForm}>
        <form
          onSubmit={forgotPasswordForm.handleSubmit((data) => {
            console.log(data);
          })}
          className="space-y-4"
          id="forgot-password-form"
        >
          <FormField
            control={forgotPasswordForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </form>
      </Form>

      <div className="flex gap-x-1 text-sm text-muted-foreground">
        <p>Remember your password?</p>
        <Link
          href="/auth/sign-in"
          className="cursor-pointer font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
