import Link from "next/link";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineMarkdown(text: string): string {
  return escapeHtml(text)
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-accent hover:underline">$1</a>'
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

export function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length === 0) return;
    elements.push(
      <ul
        key={key++}
        className="my-4 list-disc space-y-2 pl-6 text-muted-foreground"
      >
        {listItems.map((item) => (
          <li
            key={item}
            dangerouslySetInnerHTML={{ __html: inlineMarkdown(item) }}
          />
        ))}
      </ul>
    );
    listItems = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("- ")) {
      listItems.push(trimmed.slice(2));
      continue;
    }

    flushList();

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3
          key={key++}
          className="mt-8 font-heading text-xl font-semibold text-foreground"
        >
          {trimmed.slice(4)}
        </h3>
      );
    } else if (trimmed.startsWith("## ")) {
      elements.push(
        <h2
          key={key++}
          className="mt-10 font-heading text-2xl font-semibold text-foreground"
        >
          {trimmed.slice(3)}
        </h2>
      );
    } else if (trimmed.startsWith("# ")) {
      elements.push(
        <h2
          key={key++}
          className="mt-10 font-heading text-2xl font-bold text-foreground"
        >
          {trimmed.slice(2)}
        </h2>
      );
    } else if (trimmed.startsWith("|")) {
      elements.push(
        <div
          key={key++}
          className="my-6 overflow-x-auto rounded-lg border border-border/60"
        >
          <pre className="p-4 text-sm text-muted-foreground">{trimmed}</pre>
        </div>
      );
    } else if (trimmed.length > 0) {
      elements.push(
        <p
          key={key++}
          className="my-4 leading-relaxed text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: inlineMarkdown(trimmed) }}
        />
      );
    }
  }

  flushList();

  return (
    <article className="prose-freshstart max-w-none">{elements}</article>
  );
}

export function MarkdownLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const isExternal = href.startsWith("http");
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent hover:underline"
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className="text-accent hover:underline">
      {children}
    </Link>
  );
}
