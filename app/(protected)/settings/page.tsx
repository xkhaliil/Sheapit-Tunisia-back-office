import React from "react";

import { redirect } from "next/navigation";
import { signOut } from "@/auth";

import { Button } from "@/components/ui/button";

export default function Settings() {
  return (
    <div>
      Settings
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/auth/sign-in" });
        }}
      >
        <Button type="submit">Sign out</Button>
      </form>
    </div>
  );
}
