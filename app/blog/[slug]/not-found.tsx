import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/content/empty-state";

export default function BlogNotFound() {
  return (
    <section className="py-16">
      <Container>
        <EmptyState
          title="Article not found"
          description="This post may have been removed or is not yet published."
          actionLabel="Browse the blog"
          actionHref="/blog"
        />
      </Container>
    </section>
  );
}
