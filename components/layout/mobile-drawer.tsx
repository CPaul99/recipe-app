"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function MobileDrawer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            aria-hidden="true"
            onClick={close}
          />
          <aside className="relative ml-auto flex h-full w-72 flex-col gap-8 border-l border-border bg-background px-6 py-10 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close navigation"
                onClick={close}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col gap-4 text-base font-medium">
              <Link
                href="/browse"
                prefetch={false}
                className="transition-colors hover:text-foreground"
                onClick={close}
              >
                Browse recipes
              </Link>
              <Link
                href="/create"
                prefetch={false}
                className="transition-colors hover:text-foreground"
                onClick={close}
              >
                Create recipes
              </Link>
              <Link
                href="/login"
                prefetch={false}
                className="transition-colors hover:text-foreground"
                onClick={close}
              >
                Login / Signup
              </Link>
            </nav>
          </aside>
        </div>
      ) : null}
    </>
  );
}
