import Image from "next/image";

import { SignInForm } from "@/components/auth/sign-in-form";

export default function LognInPage() {
  return (
    <div>
      <div className="grid h-screen w-full">
        <div className="flex flex-col items-center justify-center space-y-4 p-6 lg:space-y-8 lg:p-12">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
