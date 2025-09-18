"use client";

import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRecipesStore } from "@/lib/stores/recipes-store";
import { ALL_RECIPE_TAGS, type RecipeTag } from "@/lib/types/recipe";
import { cn } from "@/lib/utils";

const formatTagLabel = (tag: RecipeTag) =>
  tag.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

export function RecipeFilters() {
  const searchQuery = useRecipesStore((state) => state.filters.searchQuery);
  const selectedTags = useRecipesStore((state) => state.filters.tags);
  const setSearchQuery = useRecipesStore((state) => state.setSearchQuery);
  const toggleTag = useRecipesStore((state) => state.toggleTag);
  const resetFilters = useRecipesStore((state) => state.resetFilters);

  const selectedTagSet = useMemo(() => new Set(selectedTags), [selectedTags]);

  const showResetButton =
    searchQuery.trim().length > 0 ||
    selectedTagSet.size !== ALL_RECIPE_TAGS.length;

  return (
    <div className="space-y-3 rounded-lg border bg-card p-4 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Filters</h2>
        <p className="text-sm text-muted-foreground">
          Search recipes or toggle tags to refine the list.
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">
          <span className="text-muted-foreground">Search</span>
          <Input
            value={searchQuery}
            placeholder="Search by title or description"
            aria-label="Search recipes"
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>
        <div className="space-y-2 mt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Tags
            </span>
            {showResetButton ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => resetFilters()}
              >
                Reset
              </Button>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {ALL_RECIPE_TAGS.map((tag) => {
              const isSelected = selectedTagSet.has(tag);
              return (
                <Badge
                  key={tag}
                  asChild
                  variant="outline"
                  className={cn(
                    "cursor-pointer select-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isSelected
                      ? "border-emerald-200 bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
                      : "border-rose-200 bg-rose-100 text-rose-900 hover:bg-rose-200",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleTag(tag)}
                    aria-pressed={isSelected}
                    aria-label={`Toggle ${formatTagLabel(tag)} recipes`}
                  >
                    {formatTagLabel(tag)}
                  </button>
                </Badge>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
