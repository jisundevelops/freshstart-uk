import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MotionFadeIn } from "@/components/ui/motion";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-radial-glow opacity-60"
      />
      <Container className="relative text-center">
        <MotionFadeIn>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 font-heading text-xs font-semibold uppercase tracking-widest text-accent">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            International students · United Kingdom
          </p>
          <h1 className="gradient-heading text-balance text-4xl font-bold md:text-6xl lg:text-7xl">
            {SITE_NAME}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
            {SITE_TAGLINE}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/guides">
                Explore guides
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/scholarships">Find scholarships</Link>
            </Button>
          </div>
        </MotionFadeIn>
      </Container>
    </section>
  );
}
