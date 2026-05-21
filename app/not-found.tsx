import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center py-20" aria-labelledby="not-found-heading">
      <Container className="text-center">
        <p className="font-heading text-8xl font-bold text-accent/30" aria-hidden>
          404
        </p>
        <h1
          id="not-found-heading"
          className="gradient-heading mt-4 font-heading text-3xl font-bold md:text-4xl"
        >
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          The page you are looking for does not exist or has been moved. Try heading back to the homepage or browsing our resources.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4" aria-hidden />
              Go home
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/guides">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Browse guides
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
