"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full w-64">
            <AdminSidebar />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b border-border/50 px-4 lg:hidden glass-strong">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-heading font-semibold">Admin CMS</span>
          {mobileOpen && (
            <button
              type="button"
              className="ml-auto"
              onClick={() => setMobileOpen(false)}
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </header>
        <main className={cn("flex-1 overflow-auto p-4 md:p-8")}>
          {children}
        </main>
      </div>
    </div>
  );
}
