import { sanitizeRichText } from "@/lib/admin/sanitize";

export function SanitizedHtml({ html }: { html: string }) {
  const safe = sanitizeRichText(html);
  return (
    <div
      className="prose-freshstart max-w-none"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
