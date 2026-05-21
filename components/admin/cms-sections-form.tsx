"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { toast } from "sonner";
import { saveCmsSections } from "@/actions/admin/pages";
import type { HomepageConfig, FooterConfig } from "@/actions/admin/pages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CmsSectionsFormProps {
  homepage: HomepageConfig;
  footer: FooterConfig;
  disclosure: { text: string };
  readOnly?: boolean;
}

export function CmsSectionsForm({
  homepage: initHome,
  footer: initFooter,
  disclosure: initDisc,
  readOnly,
}: CmsSectionsFormProps) {
  const [homepage, setHomepage] = useState(initHome);
  const [footer, setFooter] = useState(initFooter);
  const [disclosure, setDisclosure] = useState(initDisc);
  const [pending, startTransition] = useTransition();
  const autosaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (readOnly) return;
    if (autosaveRef.current) clearTimeout(autosaveRef.current);
    autosaveRef.current = setTimeout(() => {
      startTransition(async () => {
        const result = await saveCmsSections({ homepage, footer, disclosure });
        if (result.success) toast.success("Autosaved", { duration: 1500 });
      });
    }, 3000);
    return () => {
      if (autosaveRef.current) clearTimeout(autosaveRef.current);
    };
  }, [homepage, footer, disclosure, readOnly]);

  function handleManualSave() {
    startTransition(async () => {
      const result = await saveCmsSections({ homepage, footer, disclosure });
      if (result.success) toast.success("Sections saved");
      else toast.error(result.error);
    });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <section className="glass rounded-xl p-6 space-y-4">
        <h2 className="font-heading text-lg font-semibold">Homepage hero</h2>
        <div className="space-y-2">
          <Label>Hero title</Label>
          <Input
            value={homepage.heroTitle}
            onChange={(e) =>
              setHomepage({ ...homepage, heroTitle: e.target.value })
            }
            disabled={readOnly}
          />
        </div>
        <div className="space-y-2">
          <Label>Hero subtitle</Label>
          <Input
            value={homepage.heroSubtitle}
            onChange={(e) =>
              setHomepage({ ...homepage, heroSubtitle: e.target.value })
            }
            disabled={readOnly}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Primary CTA</Label>
            <Input
              value={homepage.ctaPrimary}
              onChange={(e) =>
                setHomepage({ ...homepage, ctaPrimary: e.target.value })
              }
              disabled={readOnly}
            />
          </div>
          <div className="space-y-2">
            <Label>Secondary CTA</Label>
            <Input
              value={homepage.ctaSecondary}
              onChange={(e) =>
                setHomepage({ ...homepage, ctaSecondary: e.target.value })
              }
              disabled={readOnly}
            />
          </div>
        </div>
      </section>

      <section className="glass rounded-xl p-6 space-y-4">
        <h2 className="font-heading text-lg font-semibold">Stats bar</h2>
        {homepage.stats.map((stat, i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Value"
              value={stat.value}
              onChange={(e) => {
                const stats = [...homepage.stats];
                stats[i] = { ...stat, value: e.target.value };
                setHomepage({ ...homepage, stats });
              }}
              disabled={readOnly}
            />
            <Input
              placeholder="Label"
              value={stat.label}
              onChange={(e) => {
                const stats = [...homepage.stats];
                stats[i] = { ...stat, label: e.target.value };
                setHomepage({ ...homepage, stats });
              }}
              disabled={readOnly}
            />
          </div>
        ))}
      </section>

      <section className="glass rounded-xl p-6 space-y-4">
        <h2 className="font-heading text-lg font-semibold">Footer & disclosure</h2>
        <div className="space-y-2">
          <Label>Footer tagline</Label>
          <Input
            value={footer.tagline}
            onChange={(e) => setFooter({ ...footer, tagline: e.target.value })}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-2">
          <Label>Affiliate disclosure</Label>
          <textarea
            value={disclosure.text}
            onChange={(e) => setDisclosure({ text: e.target.value })}
            disabled={readOnly}
            rows={4}
            className="w-full rounded-md border border-border bg-surface/50 p-3 text-sm"
          />
        </div>
      </section>

      {!readOnly && (
        <Button type="button" onClick={handleManualSave} disabled={pending}>
          {pending ? "Saving…" : "Save now"}
        </Button>
      )}
    </div>
  );
}
