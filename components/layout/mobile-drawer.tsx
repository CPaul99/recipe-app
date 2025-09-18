"use client";

import { Menu, LogIn } from "lucide-react";
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
      <SheetContent side="right" className="w-72 sm:max-w-sm bg-green-50 border-l-2 border-green-200">
        <SheetHeader className="p-0 pb-6">
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-2 text-base font-medium mt-6">
          <SheetClose asChild>
            <Link
              href="/public/browse"
              prefetch={false}
              className="px-4 py-3 rounded-lg transition-all duration-200 hover:bg-green-100 hover:text-green-800 text-slate-700 border border-transparent hover:border-green-200"
            >
              Browse recipes
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/public/create"
              prefetch={false}
              className="px-4 py-3 rounded-lg transition-all duration-200 hover:bg-green-100 hover:text-green-800 text-slate-700 border border-transparent hover:border-green-200"
            >
              Create recipes
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/auth/login"
              prefetch={false}
              className="px-4 py-3 rounded-lg transition-all duration-200 hover:bg-green-100 hover:text-green-800 text-slate-700 border border-transparent hover:border-green-200 border-t-green-200/50 flex items-center gap-2"
              aria-label="Login or signup"
            >
              <LogIn className="h-5 w-5" />
              <span className="sr-only">Login / Signup</span>
            </Link>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
