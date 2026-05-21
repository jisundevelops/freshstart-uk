import { Container } from "@/components/ui/container";

export function AffiliateDisclosure() {
  return (
    <aside
      className="border-t border-border/40 bg-surface/20 py-4"
      aria-label="Affiliate disclosure"
    >
      <Container>
        <p className="text-center text-xs leading-relaxed text-muted">
          FreshStart UK may earn a commission when you use partner links (banks,
          SIM providers, and other services). This supports free guides for
          international students at no extra cost to you. We only recommend
          providers we believe are genuinely useful for students arriving in the
          UK.
        </p>
      </Container>
    </aside>
  );
}
