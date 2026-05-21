import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Login",
};

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect("/admin");
  }

  return (
    <section className="flex items-center justify-center py-16 md:py-24">
      <Container size="narrow">
        <Card className="glass-strong mx-auto max-w-md">
          <CardHeader>
            <p className="font-heading text-xs font-semibold uppercase tracking-widest text-accent">
              FreshStart UK
            </p>
            <CardTitle className="gradient-heading text-2xl">
              Admin sign in
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
              <LoginForm />
            </Suspense>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
