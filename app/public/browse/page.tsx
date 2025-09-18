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
      <div className="space-y-6">
        <RecipeFilters />
        <RecipeList />
      </div>
    </section>
  );
}
