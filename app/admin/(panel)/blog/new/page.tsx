import { BlogForm } from "@/components/admin/blog-form";
import { getAdminContext } from "@/lib/admin/session";
import { redirect } from "next/navigation";

export const metadata = { title: "New Blog Post" };

export default async function NewBlogPage() {
  const { canWrite } = await getAdminContext();
  if (!canWrite) redirect("/admin/blog");
  return <BlogForm />;
}
