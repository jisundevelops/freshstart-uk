"use client";

import { useState } from "react";
import { Link2, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { absoluteUrl } from "@/lib/utils";

interface SocialShareProps {
  title: string;
  path: string;
}

export function SocialShare({ title, path }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const url = absoluteUrl(path);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <nav className="flex flex-wrap items-center gap-2" aria-label="Share article">
      <span className="mr-2 text-sm font-medium text-muted-foreground">
        Share
      </span>
      <Button variant="outline" size="sm" asChild>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X (Twitter)"
        >
          <Twitter className="h-4 w-4" aria-hidden />
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" aria-hidden />
        </a>
      </Button>
      <Button
        variant="outline"
        size="sm"
        type="button"
        onClick={copyLink}
        aria-label="Copy link"
      >
        <Link2 className="h-4 w-4" aria-hidden />
        <span className="ml-1 text-xs">{copied ? "Copied" : "Copy"}</span>
      </Button>
    </nav>
  );
}
