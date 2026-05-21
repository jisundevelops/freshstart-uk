"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MotionFadeIn } from "@/components/ui/motion";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const MOBILE_NAV_ID = "mobile-navigation";

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileNavRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
        hamburgerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!mobileOpen) return;
    const nav = mobileNavRef.current;
    if (!nav) return;

    const focusable = nav.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function handleTabTrap(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }

    nav.addEventListener("keydown", handleTabTrap);
    first?.focus();

    return () => nav.removeEventListener("keydown", handleTabTrap);
  }, [mobileOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 glass-strong">
      <Container>
        <MotionFadeIn className="flex h-16 items-center justify-between md:h-18">
          <Logo />

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "link-underline rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-accent"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:block">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/guides">Get started</Link>
            </Button>
          </div>

          <button
            ref={hamburgerRef}
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-foreground md:hidden"
            aria-expanded={mobileOpen}
            aria-controls={MOBILE_NAV_ID}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" aria-hidden />
            ) : (
              <Menu className="h-6 w-6" aria-hidden />
            )}
          </button>
        </MotionFadeIn>

        {mobileOpen && (
          <nav
            id={MOBILE_NAV_ID}
            ref={mobileNavRef}
            className="border-t border-border/50 py-4 md:hidden"
            aria-label="Mobile navigation"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm font-medium",
                        isActive
                          ? "bg-accent/10 text-accent"
                          : "text-muted-foreground hover:bg-surface/50 hover:text-foreground"
                      )}
                      onClick={closeMobile}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className="pt-2">
                <Button variant="default" className="w-full" asChild>
                  <Link href="/guides" onClick={closeMobile}>
                    Get started
                  </Link>
                </Button>
              </li>
            </ul>
          </nav>
        )}
      </Container>
    </header>
  );
}
