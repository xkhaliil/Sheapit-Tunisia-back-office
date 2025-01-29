import React from "react";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden min-h-screen flex-col justify-between bg-neutral-100 p-6 lg:flex lg:w-[400px]"></aside>
      <main className="min-h-screen flex-1 bg-white px-5">
        <div className="mx-auto flex h-full min-h-screen items-center justify-center sm:w-[448px]">
          <ForgotPasswordForm />
        </div>
      </main>
    </div>
  );
}
