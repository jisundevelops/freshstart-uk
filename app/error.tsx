"use client";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section
      className="flex min-h-[60vh] items-center py-20"
      aria-labelledby="error-heading"
      role="alert"
    >
      <Container className="text-center">
        <AlertTriangle
          className="mx-auto h-12 w-12 text-destructive"
          aria-hidden
        />
        <h1
          id="error-heading"
          className="mt-6 font-heading text-3xl font-bold text-foreground"
        >
          Something went wrong
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          An unexpected error occurred. Please try again or return to the
          homepage.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button onClick={reset}>Try again</Button>
          <Button variant="secondary" asChild>
            <Link href="/">
              <Home className="h-4 w-4" aria-hidden />
              Go home
            </Link>
          </Button>
        </div>
        {process.env.NODE_ENV === "development" && (
          <pre className="mt-8 max-w-lg overflow-auto rounded-lg bg-surface p-4 text-left text-xs text-muted-foreground">
            {error.message}
          </pre>
        )}
      </Container>
    </section>
  );
}
