export function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function extractCategories<T extends { category: string }>(
  items: T[]
): string[] {
  return Array.from(new Set(items.map((item) => item.category))).sort();
}

export function extractTags<T extends { tags: string[] }>(items: T[]): string[] {
  const tags = new Set<string>();
  items.forEach((item) => item.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}
