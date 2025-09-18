import Link from "next/link";

import { Button } from "@/components/ui/button";

import { MobileDrawer } from "./mobile-drawer";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          prefetch={false}
          className="text-lg font-semibold tracking-tight"
        >
          Recipe Manager
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link
            href="/browse"
            prefetch={false}
            className="transition-colors hover:text-foreground"
          >
            Browse recipes
          </Link>
          <Link
            href="/create"
            prefetch={false}
            className="transition-colors hover:text-foreground"
          >
            Create recipes
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden md:inline-flex" asChild>
            <Link href="/login" prefetch={false}>
              Login / Signup
            </Link>
          </Button>
          <MobileDrawer />
        </div>
      </div>
    </header>
  );
}
