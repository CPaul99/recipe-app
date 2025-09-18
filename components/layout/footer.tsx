import Image from "next/image";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-green-100 py-8 text-sm text-muted-foreground">
      <div className="page-container flex flex-col items-center gap-4 text-center">
        <Image
          src="/recipe-app-logo.webp"
          alt="Recipe App Logo"
          width={120}
          height={40}
          className="h-10 w-auto"
        />
        <p className="max-w-2xl text-balance">
          Helping home cooks organize their go-to dishes, discover new flavor
          ideas, and keep every recipe within reach.
        </p>
        <span className="text-xs uppercase tracking-wide text-muted-foreground/80">
          &copy; {year} Recipe Manager. Crafted for everyday cooking.
        </span>
      </div>
    </footer>
  );
}
