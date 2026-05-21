export type GuideListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string | null;
  featured: boolean;
  publishedAt: Date | null;
};

export type BlogListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  authorName: string;
  coverImage: string | null;
  tags: string[];
  featured: boolean;
  publishedAt: Date | null;
};

export type ToolListItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  href: string;
  icon: string | null;
  category: string;
  featured: boolean;
};
