export enum RecipeTag {
  Breakfast = "breakfast",
  Lunch = "lunch",
  Dinner = "dinner",
  Dessert = "dessert",
  Snack = "snack",
  Beverage = "beverage",
  Vegan = "vegan",
  Vegetarian = "vegetarian",
  GlutenFree = "gluten-free",
  DairyFree = "dairy-free",
  LowCarb = "low-carb",
  Quick = "quick",
  Healthy = "healthy",
}

export const ALL_RECIPE_TAGS: RecipeTag[] = Object.values(RecipeTag);

export type RecipeId = string;

export interface Ingredient {
  id: string;
  name: string;
  quantity?: string;
  preparation?: string;
  optional?: boolean;
}

export interface Step {
  id: string;
  order: number;
  instruction: string;
  timerMinutes?: number;
}

export interface Recipe {
  id: RecipeId;
  title: string;
  description?: string;
  author?: string;
  imageUrl?: string;
  tags: RecipeTag[];
  ingredients: Ingredient[];
  steps: Step[];
  notes?: string;
  servings?: number;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  totalTimeMinutes?: number;
  likes: number;
  dislikes: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeFilters {
  searchQuery: string;
  tags: RecipeTag[];
}

export type RecipeCreateInput = Omit<
  Recipe,
  "id" | "likes" | "dislikes" | "createdAt" | "updatedAt"
> & {
  id?: RecipeId;
  likes?: number;
  dislikes?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type RecipeUpdateInput = Partial<
  Omit<Recipe, "id" | "createdAt" | "updatedAt">
> & {
  id: RecipeId;
  updatedAt?: string;
};
