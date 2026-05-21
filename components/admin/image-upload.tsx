"use client";

import { useRef, useState, useTransition } from "react";
import { Upload } from "lucide-react";
import { uploadImage } from "@/actions/admin/upload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function ImageUpload({
  label,
  value,
  onChange,
  folder = "general",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: "blog" | "guides" | "general";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      startTransition(async () => {
        const result = await uploadImage({ file: dataUrl, folder });
        if (result.success) {
          onChange(result.data.url);
          toast.success("Image uploaded");
        } else {
          toast.error(result.error);
        }
      });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          {pending ? "Uploading…" : "Upload"}
        </Button>
        {value && (
          <span className="max-w-xs truncate text-xs text-muted">{value}</span>
        )}
      </div>
    </div>
  );
}
