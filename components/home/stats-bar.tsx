import { Container } from "@/components/ui/container";

const STATS = [
  { value: "4+", label: "Essential guides" },
  { value: "9+", label: "Partner providers" },
  { value: "5", label: "Scholarship pathways" },
  { value: "100%", label: "Free for students" },
] as const;

export function StatsBar() {
  return (
    <section aria-label="Platform statistics" className="border-y border-border/50 bg-surface/30 py-10">
      <Container>
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map((stat) => (
            <li key={stat.label} className="text-center">
              <p className="font-heading text-3xl font-bold text-accent md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
