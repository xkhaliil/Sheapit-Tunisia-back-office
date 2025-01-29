"use client";

import React from "react";

import Link from "next/link";
import { signUp } from "@/actions/auth/sign-up";
import { SignUpData, SignUpSchema } from "@/schemas";
import { Role } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import {
  BriefcaseBusinessIcon,
  Loader,
  PackageIcon,
  PersonStandingIcon,
  TriangleAlertIcon,
  TruckIcon,
  UserIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RoleCard } from "@/components/auth/cards/role-card";

type FieldName = keyof SignUpData;

interface StepsType {
  id: string;
  name: string;
  description?: string;
  fields?: FieldName[];
}

const steps: StepsType[] = [
  {
    id: "role",
    name: "Role Selection",
    description: "Select the role that best describes you.",
    fields: ["role"],
  },
  {
    id: "personal",
    name: "Personal Information",
    description: "Just your personal information",
    fields: ["name", "email", "phone", "password", "confirmPassword"],
  },
  {
    id: "business",
    name: "Business Information",
    description: "Just your business information",
    fields: ["businessName", "postalCode", "taxReference"],
  },
  {
    id: "finish",
    description: "A few finishing touches",
    name: "Finishing Touches",
  },
];

export function SignUpForm() {
  const [isPending, startTransition] = React.useTransition();
  const [currentStep, setCurrentStep] = React.useState<number>(0);
  const [previousStep, setPreviousStep] = React.useState<number>(0);
  const [success, setSuccess] = React.useState<string | undefined>("");
  const [error, setError] = React.useState<string | undefined>("");
  const delta = currentStep - previousStep;

  const signUpForm = useForm<SignUpData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: Role.SENDER,
      businessName: "",
      postalCode: "",
      taxReference: "",
    },
  });

  const processForm = async (values: SignUpData) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      signUp(values)
        .then((data) => {
          if (data?.error) {
            signUpForm.reset();
            setError(data.error);
          }

          if (data?.success) {
            signUpForm.reset();
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  const next = async () => {
    const fields = steps[currentStep].fields;

    const output = await signUpForm.trigger(fields as FieldName[], {
      shouldFocus: true,
    });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await signUpForm.handleSubmit(processForm)();
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const previous = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  const selectedRole = signUpForm.watch("role");

  return (
    <div className="w-full max-w-md p-6 xl:max-w-[600px]">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Begin your journey by creating an account.
        </p>
      </div>

      <div className="pt-6">
        <div className="relative z-10 flex w-full items-center gap-3.5 rounded-xl border p-3.5">
          <div className="flex items-center justify-center rounded-lg bg-teal-500">
            <span className="p-3 text-white">
              {currentStep === 0 ? (
                <PersonStandingIcon className="h-6 w-6" />
              ) : currentStep === 1 ? (
                <UserIcon className="h-6 w-6" />
              ) : currentStep === 2 ? (
                <BriefcaseBusinessIcon className="h-6 w-6" />
              ) : (
                <CheckIcon className="h-6 w-6" />
              )}
            </span>
          </div>
          <div className="flex flex-col items-start justify-center rounded-md">
            <h6 className="mb-0.5 text-base font-semibold text-black">
              {steps[currentStep].name}
            </h6>
            <p className="text-xs font-normal text-muted-foreground">
              {steps[currentStep].description}
            </p>
          </div>
        </div>
        <div></div>
      </div>
      <Form {...signUpForm}>
        <form onSubmit={signUpForm.handleSubmit(processForm)} className="pt-8">
          {currentStep === 0 && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <FormField
                control={signUpForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Role</FormLabel>
                    <FormDescription>
                      Select the role that best describes you.
                    </FormDescription>
                    <FormMessage />
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-4 pt-4"
                    >
                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:ring-2">
                          <FormControl>
                            <RadioGroupItem
                              value={Role.SENDER}
                              className="sr-only"
                            />
                          </FormControl>
                          <RoleCard
                            title="Sender"
                            description="Initiates the shipping process by preparing and dispatching goods for delivery."
                            checked={field.value === Role.SENDER}
                            icon={PackageIcon}
                          />
                        </FormLabel>
                      </FormItem>

                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:ring-2">
                          <FormControl>
                            <RadioGroupItem
                              value={Role.CARRIER}
                              className="sr-only"
                            />
                          </FormControl>
                          <RoleCard
                            title="Carrier"
                            description="Responsible for transporting goods from one location to another efficiently and safely."
                            checked={field.value === Role.CARRIER}
                            icon={TruckIcon}
                          />
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormItem>
                )}
              />
            </motion.div>
          )}

          {currentStep === 1 &&
            (selectedRole === Role.SENDER || selectedRole === Role.CARRIER) && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6"
              >
                <FormField
                  control={signUpForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-3">
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Full Name"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signUpForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-3">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="name@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signUpForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-6">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          placeholder="Phone Number"
                          defaultCountry="TN"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signUpForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-3">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="•••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signUpForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-3">
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="•••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}

          {currentStep === 2 && selectedRole === Role.SENDER && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6"
            >
              <FormField
                control={signUpForm.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem className="sm:col-span-6">
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Business Name"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signUpForm.control}
                name="taxReference"
                render={({ field }) => (
                  <FormItem className="sm:col-span-4">
                    <FormLabel>Tax Reference</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tax Reference"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signUpForm.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Postal Code"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}

          {currentStep === 2 && selectedRole === Role.CARRIER && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6"
            >
              <FormField
                control={signUpForm.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Company Name"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signUpForm.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Postal Code"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}

          {currentStep === 3 && success && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div
                className="rounded-xl border border-t-2 border-teal-500 bg-teal-50 p-8"
                role="alert"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-teal-500">
                    <CheckIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex flex-col gap-1 pt-4 text-center">
                    <h3 className="font-semibold tracking-tight">
                      All set! 🎉
                    </h3>
                    <p className="text-sm text-muted-foreground">{success}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button
                  variant="secondary"
                  type="button"
                  className="w-full"
                  asChild
                >
                  <Link href="/auth/sign-in">Go back to Sign In</Link>
                </Button>
              </div>
            </motion.div>
          )}

          {isPending && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="rounded-xl border border-t-2 border-blue-600 bg-blue-50 p-8">
                <div className="flex flex-col items-center justify-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-600">
                    <Loader className="h-8 w-8 animate-spin text-white" />
                  </div>
                  <div className="flex flex-col gap-1 pt-4 text-center">
                    <h3 className="font-semibold tracking-tight">Loading...</h3>
                    <p className="text-sm text-muted-foreground">
                      Please wait while we process your request.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && error && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div
                className="rounded-xl border border-t-2 border-red-600 bg-red-50 p-8"
                role="alert"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-red-600">
                    <TriangleAlertIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex flex-col gap-1 pt-4 text-center">
                    <h3 className="font-semibold tracking-tight">Oops! 😢</h3>
                    <p className="text-sm text-muted-foreground">{error}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={() => {
                    setError("");
                    setCurrentStep(0);
                  }}
                >
                  Try again
                </Button>
              </div>
            </motion.div>
          )}
        </form>
      </Form>

      {currentStep !== 3 && (
        <div className="pt-6">
          <Button
            type="button"
            onClick={next}
            disabled={currentStep === steps.length - 1}
            className="w-full"
          >
            {currentStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>

          <Button
            type="button"
            onClick={previous}
            disabled={currentStep === 0 || currentStep === steps.length - 1}
            variant="outline"
            className="mt-4 w-full"
          >
            Previous
          </Button>
        </div>
      )}

      <div className="mt-4 flex gap-x-1 text-sm text-muted-foreground">
        <p>{"Already have an account?"}</p>
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
