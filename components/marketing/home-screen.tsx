"use client";

import React from "react";

import Link from "next/link";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";

export function HomeScreen() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden rounded-lg border bg-background p-20 md:shadow-xl">
      <div className="flex flex-col items-center space-y-4">
        <div className="space-y-2">
          <p className="z-10 whitespace-pre-wrap text-center text-5xl font-semibold tracking-tighter text-black dark:text-white">
            Sheapit Tunisia Backoffice
          </p>
          <p className="z-10 whitespace-pre-wrap text-center text-xl font-medium tracking-tighter text-muted-foreground dark:text-white">
            Administrator Dashboard
          </p>
        </div>
        <Button className="z-40 w-32" asChild>
          <Link href="/auth/sign-in">Enter</Link>
        </Button>
      </div>
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.5}
        duration={1}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
      />
    </div>
  );
}
