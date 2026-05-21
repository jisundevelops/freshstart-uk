"use client";

import { useState, useTransition } from "react";
import { Mail } from "lucide-react";
import { subscribeNewsletter } from "@/actions/newsletter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/ui/container";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await subscribeNewsletter(email);
      if (result.success) {
        setMessage("You are on the list. Welcome to FreshStart UK!");
        setEmail("");
      } else {
        setMessage(result.error);
      }
    });
  }

  return (
    <section aria-label="Newsletter signup" className="py-16 md:py-20">
      <Container size="narrow">
        <div className="glass-strong rounded-2xl p-8 md:p-12 text-center">
          <Mail className="mx-auto h-10 w-10 text-accent" aria-hidden />
          <h2 className="mt-4 font-heading text-2xl font-bold text-foreground md:text-3xl">
            Get arrival tips in your inbox
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Practical checklists for banking, SIMs, visas, and life in the UK —
            no spam, just student-focused updates.
          </p>
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <Input
              type="email"
              name="email"
              placeholder="you@university.ac.uk"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
              disabled={isPending}
            />
            <Button type="submit" disabled={isPending} className="shrink-0">
              {isPending ? "Joining…" : "Subscribe"}
            </Button>
          </form>
          {message && (
            <p
              className="mt-4 text-sm text-accent"
              role="status"
              aria-live="polite"
            >
              {message}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
