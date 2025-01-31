"use client";

import React from "react";

import { login } from "@/actions/auth/sign-in";
import { SignInData, SignInSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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

import { FormError } from "../form-error";

export function SignInForm() {
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | undefined>("");

  const signInForm = useForm<SignInData>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const processForm = async (values: SignInData) => {
    setError("");

    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            signInForm.reset();
            setError(data.error);
            if (data.error === null) {
              setError("Something went wrong");
            }
          } else {
            signInForm.reset();
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    <div className="flex w-full flex-col gap-6 sm:w-[450px]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back!
          </h1>
          <span className="text-sm text-muted-foreground">
            Sign in to access your account.
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Form {...signInForm}>
          <form
            onSubmit={signInForm.handleSubmit(processForm)}
            className="space-y-4"
            id="sign-in-form"
          >
            <FormField
              control={signInForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={signInForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="•••••••••"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <FormError message={error} />}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
