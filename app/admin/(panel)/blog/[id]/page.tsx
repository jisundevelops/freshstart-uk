import { notFound } from "next/navigation";
import { getAdminBlogPost } from "@/actions/admin/blog";
import { BlogForm } from "@/components/admin/blog-form";
import { getAdminContext } from "@/lib/admin/session";

export const metadata = { title: "Edit Blog Post" };

export default async function EditBlogPage({
  params,
}: {
  params: { id: string };
}) {
  const { canWrite } = await getAdminContext();
  const result = await getAdminBlogPost(params.id);
  if (!result.success) notFound();

  return (
    <BlogForm
      post={result.data.post}
      seo={result.data.seo}
      readOnly={!canWrite}
    />
  );
}
