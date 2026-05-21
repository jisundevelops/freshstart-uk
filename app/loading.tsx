import { Container } from "@/components/ui/container";

export default function GlobalLoading() {
  return (
    <section
      className="flex min-h-[60vh] items-center py-20"
      aria-busy="true"
      aria-label="Loading page"
    >
      <Container className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" role="status">
          <span className="sr-only">Loading…</span>
        </div>
        <p className="mt-4 text-muted-foreground">Loading…</p>
      </Container>
    </section>
  );
}
