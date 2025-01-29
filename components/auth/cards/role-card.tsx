import React from "react";

import { CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";

interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  checked?: boolean;
}

export function RoleCard({
  title,
  description,
  icon: Icon,
  checked,
}: RoleCardProps) {
  return (
    <div
      className={cn(
        "relative flex cursor-pointer items-center justify-center rounded-xl border bg-white p-8 ring-offset-2 transition duration-200 ease-in-out",
        checked && "border-transparent ring-teal-500",
      )}
    >
      {checked && (
        <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-teal-500">
          <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
      )}
      <div className="flex flex-col items-center space-y-2">
        <Icon className="h-12 w-12 text-primary" />
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-center text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
