"use client";

import { useCallback, useMemo, useState } from "react";

import { RecipeForm } from "./_components/recipe-form";
import { LivePreview } from "./_components/live-preview";

import { Button } from "@/components/ui/button";
import { useRecipes } from "@/lib/hooks/use-recipes";
import { useRecipesStore } from "@/lib/stores/recipes-store";
import type { Recipe } from "@/lib/types/recipe";
import {
  createRecipeFormDefaults,
  recipeFormValuesToCreateInput,
  type RecipeFormValues,
} from "@/lib/validation/recipe-schema";

export default function CreateRecipePage() {
  const { isHydrated } = useRecipes();

  const addRecipe = useRecipesStore((state) => state.addRecipe);

  const [previewValues, setPreviewValues] = useState<RecipeFormValues>(() =>
    createRecipeFormDefaults(),
  );
  const [lastSavedRecipe, setLastSavedRecipe] = useState<Recipe | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePreviewChange = useCallback((values: RecipeFormValues) => {
    setPreviewValues(values);
  }, []);

  const handleSubmit = useCallback(
    async (values: RecipeFormValues) => {
      if (!isHydrated) {
        return;
      }

      try {
        const input = recipeFormValuesToCreateInput(values);
        const recipe = addRecipe(input);
        setLastSavedRecipe(recipe);
        setErrorMessage(null);
      } catch (error) {
        console.error(error);
        setErrorMessage("We couldn't save your recipe. Please try again.");
      }
    },
    [addRecipe, isHydrated],
  );

  const saveMessage = useMemo(() => {
    if (!lastSavedRecipe) {
      return null;
    }

    return `Saved “${lastSavedRecipe.title}” to your collection.`;
  }, [lastSavedRecipe]);

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Create a recipe
        </h1>
        <p className="text-muted-foreground">
          Build out a new recipe with ingredients, steps, and helpful notes. Use
          the live preview to see how it will look in your library before
          saving.
        </p>
      </div>

      {!isHydrated ? (
        <div
          className="rounded-md border border-muted bg-muted/40 px-4 py-3 text-sm text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          Syncing recipes from IndexedDB. You can start filling the form, and
          saving will be enabled once the sync completes.
        </div>
      ) : null}

      {saveMessage ? (
        <div
          className="flex items-center justify-between gap-3 rounded-md border border-primary/30 bg-primary/5 px-4 py-3 text-sm"
          role="status"
          aria-live="polite"
        >
          <span>{saveMessage}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setLastSavedRecipe(null)}
          >
            Dismiss
          </Button>
        </div>
      ) : null}

      {errorMessage ? (
        <div
          className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {errorMessage}
        </div>
      ) : null}

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_420px]">
        <RecipeForm
          onSubmit={handleSubmit}
          onPreviewChange={handlePreviewChange}
          isStoreReady={isHydrated}
        />
        <LivePreview values={previewValues} />
      </div>
    </section>
  );
}
