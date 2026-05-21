import { GuideCard } from "@/components/content/guide-card";
import type { GuideListItem } from "@/types/content";

export function RelatedGuides({
  guides,
  title = "Related guides",
}: {
  guides: GuideListItem[];
  title?: string;
}) {
  if (guides.length === 0) return null;

  return (
    <section aria-labelledby="related-guides-heading" className="mt-16">
      <h2
        id="related-guides-heading"
        className="font-heading text-2xl font-semibold text-foreground"
      >
        {title}
      </h2>
      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <li key={guide.id}>
            <GuideCard guide={guide} />
          </li>
        ))}
      </ul>
    </section>
  );
}
