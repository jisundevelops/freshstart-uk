"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function JsonConfigEditor({
  title,
  description,
  initialJson,
  onSave,
  previewHref,
}: {
  title: string;
  description: string;
  initialJson: string;
  onSave: (parsed: unknown) => Promise<{ success: boolean; error?: string }>;
  previewHref?: string;
}) {
  const [text, setText] = useState(initialJson);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    setError(null);
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      setError("Invalid JSON syntax");
      return;
    }

    startTransition(async () => {
      const result = await onSave(parsed);
      if (result.success) toast.success("Configuration saved");
      else toast.error(result.error ?? "Save failed");
    });
  }

  return (
    <div className="space-y-4 rounded-lg border border-border/50 glass p-4">
      <div>
        <h3 className="font-heading font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`json-${title}`}>JSON configuration</Label>
        <textarea
          id={`json-${title}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={16}
          className="w-full rounded-md border border-border bg-surface/50 p-3 font-mono text-xs text-foreground"
          spellCheck={false}
        />
        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <Button type="button" onClick={handleSave} disabled={pending}>
          {pending ? "Saving…" : "Save config"}
        </Button>
        {previewHref && (
          <Button type="button" variant="outline" asChild>
            <a href={previewHref} target="_blank" rel="noopener noreferrer">
              Live preview
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
