import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateReadingTime } from "@/lib/content";
import { formatLabel } from "@/lib/utils";
import type { GuideListItem } from "@/types/content";

interface GuideCardProps {
  guide: GuideListItem & { excerpt: string };
  readingMinutes?: number;
}

export function GuideCard({ guide, readingMinutes }: GuideCardProps) {
  const minutes =
    readingMinutes ?? calculateReadingTime(`${guide.excerpt} ${guide.title}`);

  return (
    <Card className="group h-full glow-accent-hover">
      <Link href={`/guides/${guide.slug}`} className="flex h-full flex-col">
        <CardHeader>
          <div className="mb-2 flex items-center justify-between gap-2">
            <Badge variant="outline">{formatLabel(guide.category)}</Badge>
            {guide.featured && <Badge variant="default">Featured</Badge>}
          </div>
          <CardTitle className="line-clamp-2 transition-colors group-hover:text-accent">
            {guide.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-auto flex flex-1 flex-col">
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {guide.excerpt}
          </p>
          <div className="mt-4 flex items-center justify-between text-xs text-muted">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {minutes} min read
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-accent">
              Read guide
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
