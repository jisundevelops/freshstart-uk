import Link from "next/link";
import { Plus } from "lucide-react";
import { listAdminGuides } from "@/actions/admin/guides";
import { getAdminContext } from "@/lib/admin/session";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Manage Guides" };

export default async function AdminGuidesPage() {
  const { canWrite } = await getAdminContext();
  const result = await listAdminGuides();
  const guides = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="gradient-heading font-heading text-3xl font-bold">
          Guides
        </h1>
        {canWrite && (
          <Button asChild>
            <Link href="/admin/guides/new">
              <Plus className="h-4 w-4" />
              New guide
            </Link>
          </Button>
        )}
      </div>

      {guides.length === 0 ? (
        <Card className="glass p-8 text-center text-muted-foreground">
          No guides yet.
        </Card>
      ) : (
        <ul className="space-y-3">
          {guides.map((guide) => (
            <li key={guide.id}>
              <Card className="glass glow-accent-hover">
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Link
                      href={`/admin/guides/${guide.id}`}
                      className="font-medium hover:text-accent"
                    >
                      {guide.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      /guides/{guide.slug} · {guide.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={guide.status} />
                    <span className="text-xs text-muted">
                      {formatDate(guide.updatedAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
