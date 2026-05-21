"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Newspaper,
  Link2,
  FileText,
  Wrench,
  Settings,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/guides", label: "Guides", icon: BookOpen },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/affiliates", label: "Affiliates", icon: Link2 },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/tools", label: "Tools", icon: Wrench },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border/50 bg-surface/40 glass-strong">
      <div className="border-b border-border/50 p-4">
        <Logo />
        <p className="mt-2 text-xs text-muted">Content management</p>
      </div>
      <nav className="flex-1 space-y-1 p-3" aria-label="Admin navigation">
        {NAV.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-accent/15 text-accent"
                  : "text-muted-foreground hover:bg-surface/60 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border/50 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-accent"
        >
          <ExternalLink className="h-4 w-4" />
          View live site
        </Link>
      </div>
    </aside>
  );
}
