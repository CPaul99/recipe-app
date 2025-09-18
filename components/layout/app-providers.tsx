"use client";

import type { ReactNode } from "react";

import { useRecipes } from "@/lib/hooks/use-recipes";
import type { Recipe } from "@/lib/types/recipe";

type AppProvidersProps = {
  children: ReactNode;
  initialRecipes?: Recipe[];
};

export function AppProviders({
  children,
  initialRecipes = [],
}: AppProvidersProps) {
  useRecipes(initialRecipes);

  return <>{children}</>;
}
