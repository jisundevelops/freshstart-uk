import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/content/empty-state";

export default function GuideNotFound() {
  return (
    <section className="py-16">
      <Container>
        <EmptyState
          title="Guide not found"
          description="This guide may have been moved or is not yet published."
          actionLabel="Browse all guides"
          actionHref="/guides"
        />
        <div className="mt-6 text-center">
          <Button variant="ghost" asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
