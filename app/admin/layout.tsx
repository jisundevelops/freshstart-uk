import { AuthSessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthSessionProvider>
      <Toaster theme="dark" position="top-right" richColors closeButton />
      {children}
    </AuthSessionProvider>
  );
}
