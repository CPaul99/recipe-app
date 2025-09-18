"use client";

import { Menu } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export function MobileDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 sm:max-w-sm">
        <SheetHeader className="p-0 pb-6">
          <SheetTitle className="text-lg">Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 text-base font-medium">
          <SheetClose asChild>
            <Link
              href="/browse"
              prefetch={false}
              className="transition-colors hover:text-foreground"
            >
              Browse recipes
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/create"
              prefetch={false}
              className="transition-colors hover:text-foreground"
            >
              Create recipes
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/login"
              prefetch={false}
              className="transition-colors hover:text-foreground"
            >
              Login / Signup
            </Link>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
