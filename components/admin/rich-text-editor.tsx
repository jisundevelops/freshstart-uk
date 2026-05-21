"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  editable?: boolean;
  className?: string;
}

interface ToolbarButton {
  label: string;
  ariaLabel: string;
  action: () => void;
  isActive: () => boolean;
}

export function RichTextEditor({
  content,
  onChange,
  editable = true,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({}),
      Link.configure({ openOnClick: false }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    editable,
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose-freshstart min-h-[280px] max-w-none px-4 py-3 focus:outline-none text-foreground",
        "aria-label": "Content editor",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  // Custom link dialog instead of window.prompt
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const linkInputRef = useRef<HTMLInputElement>(null);

  const openLinkDialog = useCallback(() => {
    if (!editor) return;
    setLinkUrl("");
    setLinkDialogOpen(true);
  }, [editor]);

  const submitLink = useCallback(() => {
    if (!editor || !linkUrl) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    setLinkDialogOpen(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  if (!editor) return null;

  const toolbarButtons: ToolbarButton[] = [
    {
      label: "B",
      ariaLabel: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      label: "I",
      ariaLabel: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      label: "H2",
      ariaLabel: "Heading level 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    {
      label: "List",
      ariaLabel: "Bullet list",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      label: "Link",
      ariaLabel: "Insert link",
      action: openLinkDialog,
      isActive: () => editor.isActive("link"),
    },
    {
      label: "Code",
      ariaLabel: "Code block",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive("codeBlock"),
    },
    {
      label: "Table",
      ariaLabel: "Insert table",
      action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run(),
      isActive: () => false,
    },
  ];

  return (
    <div className={cn("rounded-lg border border-border/60 glass", className)}>
      {editable && (
        <div
          className="flex flex-wrap gap-1 border-b border-border/50 p-2"
          role="toolbar"
          aria-label="Editor toolbar"
        >
          {toolbarButtons.map((btn) => (
            <Button
              key={btn.ariaLabel}
              type="button"
              size="sm"
              variant="ghost"
              onClick={btn.action}
              aria-pressed={btn.isActive()}
              aria-label={btn.ariaLabel}
              title={btn.ariaLabel}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      )}
      <EditorContent editor={editor} />

      {/* Accessible link dialog (replaces window.prompt) */}
      {linkDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80"
          role="dialog"
          aria-label="Insert link"
          aria-modal="true"
        >
          <div className="glass-strong rounded-xl p-6 shadow-2xl">
            <h3 className="font-heading text-lg font-semibold text-foreground">
              Insert link
            </h3>
            <label htmlFor="link-url-input" className="mt-3 block text-sm text-muted-foreground">
              URL
            </label>
            <input
              ref={linkInputRef}
              id="link-url-input"
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitLink();
                if (e.key === "Escape") setLinkDialogOpen(false);
              }}
              placeholder="https://"
              className="mt-1 w-72 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setLinkDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={submitLink}>
                Insert
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
