import Image from "next/image";
import Link from "next/link";
import { LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";

import { MobileDrawer } from "./mobile-drawer";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-green-100 backdrop-blur">
      <div className="page-container flex h-16 items-center justify-between">
        <Link href="/" prefetch={false} className="flex items-center pb-0">
          <Image
            src="/recipe-app-logo.webp"
            alt="Recipe Manager"
            width={160}
            height={67}
            priority
            className="h-8 w-auto"
          />
        </Link>
        <nav className="hidden items-center gap-6 text-base font-medium text-muted-foreground md:flex">
          <Link
            href="/public/browse"
            prefetch={false}
            className="transition-colors hover:text-foreground"
          >
            Browse recipes
          </Link>
          <Link
            href="/public/create"
            prefetch={false}
            className="transition-colors hover:text-foreground"
          >
            Create recipes
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex hover:bg-green-400"
            asChild
          >
            <Link
              href="/auth/login"
              prefetch={false}
              aria-label="Login or signup"
            >
              <LogIn className="h-5 w-5" />
              <span className="sr-only">Login / Signup</span>
            </Link>
          </Button>
          <MobileDrawer />
        </div>
      </div>
    </header>
  );
}
