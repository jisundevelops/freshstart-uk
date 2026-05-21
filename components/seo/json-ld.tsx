/** Safely serialises JSON-LD and escapes </script sequences to prevent XSS */
function safeJsonLdSerialize(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/<\/script/gi, "<\\/script");
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdSerialize(data) }}
    />
  );
}
