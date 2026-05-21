import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateReadingTime, formatDate } from "@/lib/content";
import type { BlogListItem } from "@/types/content";

interface BlogCardProps {
  post: BlogListItem;
}

export function BlogCard({ post }: BlogCardProps) {
  const minutes = calculateReadingTime(`${post.excerpt} ${post.title}`);

  return (
    <Card className="group h-full glow-accent-hover">
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        <CardHeader>
          <div className="mb-2 flex flex-wrap gap-2">
            {post.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <CardTitle className="line-clamp-2 transition-colors group-hover:text-accent">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-auto flex flex-1 flex-col">
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {post.excerpt}
          </p>
          <div className="mt-4 flex items-center justify-between text-xs text-muted">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {minutes} min
              {post.publishedAt && (
                <span aria-hidden>·</span>
              )}
              {post.publishedAt && (
                <time dateTime={post.publishedAt.toISOString()}>
                  {formatDate(post.publishedAt)}
                </time>
              )}
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-accent">
              Read
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
