import { BlogCard } from "@/components/content/blog-card";
import type { BlogListItem } from "@/types/content";

export function RelatedPosts({
  posts,
  title = "Related articles",
}: {
  posts: BlogListItem[];
  title?: string;
}) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="related-posts-heading" className="mt-16">
      <h2
        id="related-posts-heading"
        className="font-heading text-2xl font-semibold text-foreground"
      >
        {title}
      </h2>
      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.id}>
            <BlogCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
}
