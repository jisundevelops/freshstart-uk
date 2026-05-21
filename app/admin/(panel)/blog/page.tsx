import Link from "next/link";
import { Plus } from "lucide-react";
import { listAdminBlogPosts } from "@/actions/admin/blog";
import { getAdminContext } from "@/lib/admin/session";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Manage Blog" };

export default async function AdminBlogPage() {
  const { canWrite } = await getAdminContext();
  const result = await listAdminBlogPosts();
  const posts = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="gradient-heading font-heading text-3xl font-bold">
          Blog
        </h1>
        {canWrite && (
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="h-4 w-4" />
              New post
            </Link>
          </Button>
        )}
      </div>

      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.id}>
            <Card className="glass">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="font-medium hover:text-accent"
                  >
                    {post.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    /blog/{post.slug}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={post.status} />
                  <span className="text-xs text-muted">
                    {formatDate(post.updatedAt)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
