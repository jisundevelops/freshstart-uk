"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/container";
import { TESTIMONIALS } from "@/lib/testimonials";

export function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const testimonial = TESTIMONIALS[index];

  if (!testimonial) return null;

  return (
    <section
      aria-label="Student testimonials"
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
          <div
            className="mt-6 flex justify-center gap-2"
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
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
