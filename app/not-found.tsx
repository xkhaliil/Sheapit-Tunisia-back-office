import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="container flex max-w-md flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            404
          </h1>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Page Not Found
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Sorry, we couldn't find the page you're looking for. The page might
            have been removed or the link might be broken.
          </p>
        </div>
        <div className="flex justify-center">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
