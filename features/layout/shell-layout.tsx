import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

type ShellLayoutProps = {
  children: ReactNode;
};

export function ShellLayout({ children }: ShellLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-yellow-50 via-green-50 to-yellow-50 section-spacing-y">
        <div className="page-container">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
