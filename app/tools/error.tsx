"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function ToolsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[tools]", error);
  }, [error]);

  return (
    <section className="py-16">
      <Container className="text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Something went wrong
        </h1>
        <p className="mt-2 text-muted-foreground">
          This tool could not load. Please try again.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/tools">All tools</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
