import { RecipeFilters } from "./_components/recipe-filters";
import { RecipeList } from "./_components/recipe-list";

export default function BrowsePage() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight">
          Browse Recipes
        </h1>
        <p className="text-base text-muted-foreground">
          Explore your saved dishes, toggle tags, and search for inspiration in
          your collection.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <RecipeFilters />
        <RecipeList />
      </div>
    </section>
  );
}
