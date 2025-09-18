"use client";

import { useMemo } from "react";
import { MessageSquareMore, ThumbsDown, ThumbsUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEFAULT_RECIPE_IMAGE } from "@/lib/constants/images";
import {
  useRecipesStore,
  selectReactionCounts,
} from "@/lib/stores/recipes-store";
import type { Recipe } from "@/lib/types/recipe";

type RecipeCardProps = {
  recipe: Recipe;
};

const formatTagLabel = (tag: string) =>
  tag.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

export function RecipeCard({ recipe }: RecipeCardProps) {
  const likeRecipe = useRecipesStore((state) => state.likeRecipe);
  const dislikeRecipe = useRecipesStore((state) => state.dislikeRecipe);
  const { likes, dislikes } = useRecipesStore(selectReactionCounts(recipe.id));

  const steps = useMemo(() => {
    if (!Array.isArray(recipe.steps)) {
      return [] as Recipe["steps"];
    }

    const sorted = [...recipe.steps].sort(
      (left, right) => left.order - right.order,
    );
    return sorted.slice(0, 7);
  }, [recipe.steps]);

  const hasMoreSteps = recipe.steps.length > steps.length;

  const imageUrl = recipe.imageUrl || DEFAULT_RECIPE_IMAGE;

  return (
    <article className="flex h-full flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-2">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-md border bg-muted">
          <img
            src={imageUrl}
            alt={recipe.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {recipe.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {formatTagLabel(tag)}
            </Badge>
          ))}
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-semibold leading-tight">
            {recipe.title}
          </h3>
          {recipe.description ? (
            <p className="text-sm text-muted-foreground">
              {recipe.description}
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-3 text-sm">
        {recipe.ingredients.length > 0 ? (
          <div className="space-y-1">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Ingredients
            </h4>
            <ul className="list-disc space-y-1 pl-5">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.id} className="leading-relaxed">
                  <span className="font-medium">{ingredient.name}</span>
                  {ingredient.quantity ? (
                    <span className="text-muted-foreground">
                      {" "}
                      - {ingredient.quantity}
                    </span>
                  ) : null}
                  {ingredient.preparation ? (
                    <span className="text-muted-foreground">
                      {" "}
                      ({ingredient.preparation})
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {steps.length > 0 ? (
          <div className="space-y-1">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Steps
            </h4>
            <ol className="list-decimal space-y-1 pl-5">
              {steps.map((step) => (
                <li key={step.id} className="leading-relaxed">
                  {step.instruction}
                </li>
              ))}
            </ol>
            {hasMoreSteps ? (
              <p className="text-xs text-muted-foreground">
                Showing first 7 steps. View the recipe to see more.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="mt-auto flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => likeRecipe(recipe.id)}
            aria-label={`Like ${recipe.title}`}
          >
            <ThumbsUp className="mr-2 h-4 w-4" aria-hidden="true" />
            {likes}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => dislikeRecipe(recipe.id)}
            aria-label={`Dislike ${recipe.title}`}
          >
            <ThumbsDown className="mr-2 h-4 w-4" aria-hidden="true" />
            {dislikes}
          </Button>
        </div>
        <div className="flex items-start gap-2 rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
          <MessageSquareMore
            className="mt-0.5 h-4 w-4 flex-shrink-0"
            aria-hidden="true"
          />
          <p>Comments are coming soon. Stay tuned!</p>
        </div>
      </div>
    </article>
  );
}
