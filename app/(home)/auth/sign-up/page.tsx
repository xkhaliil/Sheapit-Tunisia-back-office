import React from "react";

import Image from "next/image";

import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpPge() {
  return (
    <div>
      <div className="grid h-screen w-full grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col items-center justify-center space-y-4 p-6 lg:space-y-8 lg:p-12">
          <SignUpForm />
        </div>
        <div className="hidden h-screen bg-muted lg:block">
          <Image
            src="/auth.jpeg"
            alt="Image"
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </div>
  );
}
