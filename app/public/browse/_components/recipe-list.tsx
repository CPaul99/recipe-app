"use client";

import { shallow } from "zustand/shallow";

import { RecipeCard } from "./recipe-card";

import { useRecipes } from "@/lib/hooks/use-recipes";
import {
  useRecipesStore,
  selectFilteredRecipes,
} from "@/lib/stores/recipes-store";

export function RecipeList() {
  const { isHydrated } = useRecipes();
  const recipes = useRecipesStore(selectFilteredRecipes, shallow);

  if (!isHydrated) {
    return (
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Loading recipes...
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="rounded-lg border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
        No recipes match your current filters. Try adjusting the search or tags.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
