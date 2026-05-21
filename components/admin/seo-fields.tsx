"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface SeoFieldsValue {
  metaTitle: string;
  metaDesc: string;
  ogImage: string;
}

export function SeoFields({
  value,
  onChange,
}: {
  value: SeoFieldsValue;
  onChange: (v: SeoFieldsValue) => void;
}) {
  return (
    <fieldset className="space-y-4 rounded-lg border border-border/50 p-4">
      <legend className="px-1 font-heading text-sm font-semibold text-foreground">
        SEO & Open Graph
      </legend>
      <div className="space-y-2">
        <Label htmlFor="metaTitle">Meta title</Label>
        <Input
          id="metaTitle"
          value={value.metaTitle}
          onChange={(e) => onChange({ ...value, metaTitle: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="metaDesc">Meta description</Label>
        <Input
          id="metaDesc"
          value={value.metaDesc}
          onChange={(e) => onChange({ ...value, metaDesc: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ogImage">OG image URL</Label>
        <Input
          id="ogImage"
          type="url"
          value={value.ogImage}
          onChange={(e) => onChange({ ...value, ogImage: e.target.value })}
          placeholder="https://..."
        />
      </div>
    </fieldset>
  );
}
