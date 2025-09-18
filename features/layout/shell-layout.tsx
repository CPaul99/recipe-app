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
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
