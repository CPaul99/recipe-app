"use client";

import { useMemo } from "react";

import { RecipeCard } from "@/app/(public)/browse/_components/recipe-card";
import type { Recipe } from "@/lib/types/recipe";
import {
  recipeFormValuesToCreateInput,
  type RecipeFormValues,
} from "@/lib/validation/recipe-schema";

const PREVIEW_RECIPE_ID = "preview-recipe";

const buildPreviewRecipe = (values: RecipeFormValues): Recipe => {
  const input = recipeFormValuesToCreateInput(values);

  const filteredIngredients = input.ingredients.filter((ingredient) =>
    ingredient.name.trim(),
  );

  const filteredSteps = input.steps
    .filter((step) => step.instruction.trim())
    .map((step, index) => ({
      ...step,
      order: index + 1,
    }));

  const now = new Date().toISOString();

  return {
    id: PREVIEW_RECIPE_ID,
    title: input.title.trim() || "Untitled recipe",
    description: input.description,
    author: input.author,
    imageUrl: input.imageUrl,
    tags: input.tags,
    ingredients: filteredIngredients,
    steps: filteredSteps,
    notes: input.notes,
    servings: input.servings,
    prepTimeMinutes: input.prepTimeMinutes,
    cookTimeMinutes: input.cookTimeMinutes,
    totalTimeMinutes: input.totalTimeMinutes,
    likes: 0,
    dislikes: 0,
    createdAt: now,
    updatedAt: now,
  };
};

type LivePreviewProps = {
  values: RecipeFormValues;
};

export function LivePreview({ values }: LivePreviewProps) {
  const previewRecipe = useMemo(() => buildPreviewRecipe(values), [values]);

  const hasContent =
    previewRecipe.title.trim().length > 0 ||
    previewRecipe.description?.length ||
    previewRecipe.ingredients.length > 0 ||
    previewRecipe.steps.length > 0;

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Live preview</h2>
        <p className="text-sm text-muted-foreground">
          Updates as you edit, matching the browse card layout.
        </p>
      </div>
      <div className="rounded-lg border bg-muted/30 p-4">
        {hasContent ? (
          <div className="pointer-events-none">
            <RecipeCard recipe={previewRecipe} />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Start filling out the form to see the live preview of your recipe.
          </p>
        )}
      </div>
    </section>
  );
}
