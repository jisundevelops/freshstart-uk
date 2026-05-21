"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/container";
import { TESTIMONIALS } from "@/lib/testimonials";

export function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Auto-advance with pause support
  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setIndex((current) => (current + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  const goTo = useCallback((i: number) => setIndex(i), []);
  const goPrev = useCallback(
    () => setIndex((current) => (current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length),
    []
  );
  const goNext = useCallback(
    () => setIndex((current) => (current + 1) % TESTIMONIALS.length),
    []
  );

  const testimonial = TESTIMONIALS[index];

  if (!testimonial) return null;

  return (
    <section
      ref={sectionRef}
      aria-label="Student testimonials"
      aria-roledescription="carousel"
      className="py-16 md:py-20"
    >
      <Container size="narrow">
        <h2 className="gradient-heading text-center font-heading text-3xl font-bold">
          Students who started fresh
        </h2>
        <div className="relative mt-10 min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={testimonial.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="glass rounded-xl p-8 text-center"
              role="group"
              aria-roledescription="slide"
              aria-label={`Testimonial ${index + 1} of ${TESTIMONIALS.length}: ${testimonial.name}`}
            >
              <Quote
                className="mx-auto mb-4 h-8 w-8 text-accent/60"
                aria-hidden
              />
              <p className="text-lg leading-relaxed text-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <footer className="mt-6">
                <cite className="not-italic">
                  <span className="font-heading font-semibold text-accent">
                    {testimonial.name}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {testimonial.university} · {testimonial.country}
                  </span>
                </cite>
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          {/* Navigation controls */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous testimonial"
              className="rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              &#8592;
            </button>
            <div
              className="flex gap-2"
              role="tablist"
              aria-label="Testimonial slides"
            >
              {TESTIMONIALS.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === index
                      ? "w-8 bg-accent"
                      : "w-2 bg-border hover:bg-muted"
                  }`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next testimonial"
              className="rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              &#8594;
            </button>
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              aria-label={isPaused ? "Resume auto-advance" : "Pause auto-advance"}
              className="rounded-md p-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {isPaused ? "▶" : "⏸"}
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
