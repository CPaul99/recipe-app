"use client";

import { useSeedData } from "@/lib/hooks/use-seed-data";
import { useRecipesStore, selectAllRecipes } from "@/lib/stores/recipes-store";

export function SeedDataLoader() {
  const { loadSeedData } = useSeedData();
  const recipes = useRecipesStore(selectAllRecipes);

  const handleLoadSeedData = async () => {
    try {
      const loadedRecipes = await loadSeedData();
      alert(`Successfully loaded ${loadedRecipes.length} seed recipes!`);
    } catch (error) {
      console.error('Error loading seed data:', error);
      alert('Failed to load seed data. Check the console for details.');
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-semibold mb-2">Seed Data Loader</h3>
      <p className="text-sm text-gray-600 mb-3">
        Load 12 sample recipes to test the Browse recipes page.
      </p>
      <button
        onClick={handleLoadSeedData}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Load Seed Recipes ({recipes.length} currently loaded)
      </button>
    </div>
  );
}