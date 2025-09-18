import { useRecipesStore } from "../stores/recipes-store";
import type { Recipe } from "../types/recipe";

export const useSeedData = () => {
  const setRecipes = useRecipesStore((state) => state.setRecipes);
  const markHydrated = useRecipesStore((state) => state.markHydrated);

  const loadSeedData = async () => {
    try {
      const response = await fetch('/seed-data/recipes.json');
      if (!response.ok) {
        throw new Error('Failed to load seed data');
      }

      const recipes: Recipe[] = await response.json();

      // Ensure the store is marked as hydrated so persistence works
      markHydrated();

      // Use setRecipes to load all at once - this will trigger persistence via the subscription
      setRecipes(recipes);

      console.log(`✅ Loaded ${recipes.length} seed recipes into the store`);
      return recipes;
    } catch (error) {
      console.error('❌ Failed to load seed data:', error);
      throw error;
    }
  };

  return { loadSeedData };
};