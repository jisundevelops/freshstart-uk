/**
 * Lightweight HTML sanitization for server-side rendering.
 *
 * The previous implementation used `isomorphic-dompurify` which depends on `jsdom`.
 * `jsdom` is incompatible with Vercel's serverless runtime and caused
 * `DYNAMIC_SERVER_USAGE` / 500 errors on every dynamic page that imported it.
 *
 * This replacement performs tag- and attribute-level allowlisting without `jsdom`,
 * so it works in all Node.js and Edge runtimes.
 */

// ─── allowlists ──────────────────────────────────────────────────────────────

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "hr",
  "strong",
  "em",
  "u",
  "s",
  "h1",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "blockquote",
  "pre",
  "code",
  "a",
  "img",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "span",
  "div",
]);

const ALLOWED_ATTR = new Set([
  "href",
  "src",
  "alt",
  "title",
  "class",
  "target",
  "rel",
  "colspan",
  "rowspan",
]);

const SELF_CLOSING = new Set(["br", "hr", "img"]);

// ─── simple tag-level sanitizer ──────────────────────────────────────────────

/**
 * Strip any HTML tag that is not in the allowlist, and remove any attribute
 * that is not in the attribute allowlist.  This is NOT a full HTML parser —
 * it is designed for the controlled output of the TipTap WYSIWYG editor where
 * the input is already well-formed.
 */
export function sanitizeRichText(html: string): string {
  // Process the HTML by matching tags and filtering them
  return html.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*\/?>/g, (match, tagName) => {
    const tag = tagName.toLowerCase();

    // Closing tag
    if (match.startsWith("</")) {
      return ALLOWED_TAGS.has(tag) ? match : "";
    }

    // Not allowed — strip the whole tag
    if (!ALLOWED_TAGS.has(tag)) {
      return "";
    }

    // Self-closing with no attributes
    if (SELF_CLOSING.has(tag) && match.endsWith("/>")) {
      return `<${tag}/>`;
    }

    // Opening tag — filter attributes
    const attrRegex = /\s([a-zA-Z][a-zA-Z0-9-]*)=(?:"[^"]*"|'[^']*'|[^\s>]+)/g;
    let filtered = `<${tag}`;
    let attrMatch: RegExpExecArray | null;

    while ((attrMatch = attrRegex.exec(match)) !== null) {
      const attrName = (attrMatch[1] ?? "").toLowerCase();
      if (ALLOWED_ATTR.has(attrName)) {
        filtered += ` ${attrMatch[0]}`;
      }
    }

    filtered += ">";
    return filtered;
  });
}

/**
 * Quick check: does the content start with an HTML tag?
 * Used to decide between MarkdownContent and SanitizedHtml rendering.
 */
export function isHtmlContent(content: string): boolean {
  return content.trimStart().startsWith("<");
}
