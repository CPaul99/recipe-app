import { create } from "zustand";

import {
  ALL_RECIPE_TAGS,
  type Recipe,
  type RecipeCreateInput,
  type RecipeFilters,
  type RecipeId,
  type RecipeTag,
  type RecipeUpdateInput,
} from "../types/recipe";

const createDefaultFilters = (): RecipeFilters => ({
  searchQuery: "",
  tags: [...ALL_RECIPE_TAGS],
});

type RecipesState = {
  recipesById: Record<RecipeId, Recipe>;
  recipeOrder: RecipeId[];
  filters: RecipeFilters;
  isHydrated: boolean;
};

type RecipesActions = {
  setRecipes: (recipes: Recipe[]) => void;
  addRecipe: (input: RecipeCreateInput) => Recipe;
  upsertRecipe: (input: RecipeCreateInput) => Recipe;
  updateRecipe: (input: RecipeUpdateInput) => Recipe | undefined;
  removeRecipe: (id: RecipeId) => void;
  likeRecipe: (id: RecipeId) => void;
  dislikeRecipe: (id: RecipeId) => void;
  resetReactions: (id: RecipeId) => void;
  setFilters: (filters: Partial<RecipeFilters>) => void;
  toggleTag: (tag: RecipeTag) => void;
  resetFilters: () => void;
  setSearchQuery: (searchQuery: string) => void;
  markHydrated: () => void;
};

export type RecipesStoreState = RecipesState & RecipesActions;

const buildRecipeFromInput = (input: RecipeCreateInput): Recipe => {
  const now = new Date().toISOString();

  return {
    id: input.id ?? crypto.randomUUID(),
    title: input.title,
    description: input.description,
    author: input.author,
    imageUrl: input.imageUrl,
    tags: input.tags ?? [],
    ingredients: input.ingredients ?? [],
    steps: input.steps ?? [],
    notes: input.notes,
    servings: input.servings,
    prepTimeMinutes: input.prepTimeMinutes,
    cookTimeMinutes: input.cookTimeMinutes,
    totalTimeMinutes: input.totalTimeMinutes,
    likes: input.likes ?? 0,
    dislikes: input.dislikes ?? 0,
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  };
};

const toRecord = (recipes: Recipe[]) => {
  return recipes.reduce<{
    recipesById: Record<RecipeId, Recipe>;
    recipeOrder: RecipeId[];
  }>(
    (acc, recipe) => {
      acc.recipesById[recipe.id] = recipe;
      acc.recipeOrder.push(recipe.id);
      return acc;
    },
    { recipesById: {}, recipeOrder: [] },
  );
};

export const useRecipesStore = create<RecipesStoreState>((set, get) => ({
  recipesById: {},
  recipeOrder: [],
  filters: createDefaultFilters(),
  isHydrated: false,

  setRecipes: (recipes) => {
    const mapped = toRecord(recipes);
    set({
      recipesById: mapped.recipesById,
      recipeOrder: mapped.recipeOrder,
    });
  },

  addRecipe: (input) => {
    const recipe = buildRecipeFromInput({
      ...input,
      likes: input.likes ?? 0,
      dislikes: input.dislikes ?? 0,
    });

    set((state) => {
      if (state.recipesById[recipe.id]) {
        throw new Error(`Recipe with id "${recipe.id}" already exists`);
      }

      return {
        recipesById: {
          ...state.recipesById,
          [recipe.id]: recipe,
        },
        recipeOrder: [...state.recipeOrder, recipe.id],
      };
    });

    return recipe;
  },

  upsertRecipe: (input) => {
    const existing = input.id ? get().recipesById[input.id] : undefined;

    if (existing) {
      const updatedRecipe = {
        ...existing,
        ...input,
        id: existing.id,
        likes: input.likes ?? existing.likes,
        dislikes: input.dislikes ?? existing.dislikes,
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        recipesById: {
          ...state.recipesById,
          [existing.id]: updatedRecipe,
        },
      }));

      return updatedRecipe;
    }

    return get().addRecipe(input);
  },

  updateRecipe: (input) => {
    const existing = get().recipesById[input.id];

    if (!existing) {
      return undefined;
    }

    const updatedRecipe: Recipe = {
      ...existing,
      ...input,
      id: existing.id,
      likes: input.likes ?? existing.likes,
      dislikes: input.dislikes ?? existing.dislikes,
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      recipesById: {
        ...state.recipesById,
        [existing.id]: updatedRecipe,
      },
    }));

    return updatedRecipe;
  },

  removeRecipe: (id) => {
    set((state) => {
      if (!state.recipesById[id]) {
        return state;
      }

      const nextRecipes = { ...state.recipesById };
      delete nextRecipes[id];

      return {
        recipesById: nextRecipes,
        recipeOrder: state.recipeOrder.filter((recipeId) => recipeId !== id),
      };
    });
  },

  likeRecipe: (id) => {
    set((state) => {
      const recipe = state.recipesById[id];
      if (!recipe) return state;

      return {
        recipesById: {
          ...state.recipesById,
          [id]: {
            ...recipe,
            likes: recipe.likes + 1,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  },

  dislikeRecipe: (id) => {
    set((state) => {
      const recipe = state.recipesById[id];
      if (!recipe) return state;

      return {
        recipesById: {
          ...state.recipesById,
          [id]: {
            ...recipe,
            dislikes: recipe.dislikes + 1,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  },

  resetReactions: (id) => {
    set((state) => {
      const recipe = state.recipesById[id];
      if (!recipe) return state;

      return {
        recipesById: {
          ...state.recipesById,
          [id]: {
            ...recipe,
            likes: 0,
            dislikes: 0,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  },

  setFilters: (filters) => {
    set((state) => {
      const nextTags = filters.tags
        ? Array.from(new Set(filters.tags))
        : state.filters.tags;
      return {
        filters: {
          ...state.filters,
          ...filters,
          tags: nextTags,
        },
      };
    });
  },

  toggleTag: (tag) => {
    set((state) => {
      const hasTag = state.filters.tags.includes(tag);
      const nextTags = hasTag
        ? state.filters.tags.filter((existingTag) => existingTag !== tag)
        : [...state.filters.tags, tag];

      return {
        filters: {
          ...state.filters,
          tags: nextTags,
        },
      };
    });
  },

  resetFilters: () => set({ filters: createDefaultFilters() }),

  setSearchQuery: (searchQuery) =>
    set((state) => ({
      filters: {
        ...state.filters,
        searchQuery,
      },
    })),

  markHydrated: () => set({ isHydrated: true }),
}));

export const selectRecipeEntities = (state: RecipesStoreState) =>
  state.recipesById;

export const selectRecipeOrder = (state: RecipesStoreState) =>
  state.recipeOrder;

type OrderedRecipesCache = {
  recipeOrderRef: RecipesStoreState["recipeOrder"];
  recipesByIdRef: RecipesStoreState["recipesById"];
  result: Recipe[];
};

let orderedRecipesCache: OrderedRecipesCache | null = null;

const getOrderedRecipes = (state: RecipesStoreState) => {
  if (
    orderedRecipesCache &&
    orderedRecipesCache.recipeOrderRef === state.recipeOrder &&
    orderedRecipesCache.recipesByIdRef === state.recipesById
  ) {
    return orderedRecipesCache.result;
  }

  const ordered = state.recipeOrder
    .map((id) => state.recipesById[id])
    .filter((recipe): recipe is Recipe => Boolean(recipe));

  orderedRecipesCache = {
    recipeOrderRef: state.recipeOrder,
    recipesByIdRef: state.recipesById,
    result: ordered,
  };

  return ordered;
};

export const selectAllRecipes = (state: RecipesStoreState) =>
  getOrderedRecipes(state);

export const selectRecipeById =
  (recipeId: RecipeId) => (state: RecipesStoreState) =>
    state.recipesById[recipeId];

export const selectFilters = (state: RecipesStoreState) => state.filters;

export const selectSearchQuery = (state: RecipesStoreState) =>
  state.filters.searchQuery;

export const selectSelectedTags = (state: RecipesStoreState) =>
  state.filters.tags;

export const selectIsHydrated = (state: RecipesStoreState) => state.isHydrated;

type FilteredRecipesCache = {
  recipeOrderRef: RecipesStoreState["recipeOrder"];
  recipesByIdRef: RecipesStoreState["recipesById"];
  searchQuery: string;
  tagsKey: string;
  result: Recipe[];
};

let filteredRecipesCache: FilteredRecipesCache | null = null;

export const selectFilteredRecipes = (state: RecipesStoreState) => {
  const searchQuery = state.filters.searchQuery;
  const tagsKey = state.filters.tags.join("|");

  if (
    filteredRecipesCache &&
    filteredRecipesCache.recipeOrderRef === state.recipeOrder &&
    filteredRecipesCache.recipesByIdRef === state.recipesById &&
    filteredRecipesCache.searchQuery === searchQuery &&
    filteredRecipesCache.tagsKey === tagsKey
  ) {
    return filteredRecipesCache.result;
  }

  const recipes = getOrderedRecipes(state);
  const query = searchQuery.trim().toLowerCase();
  const activeTags = state.filters.tags;

  const filtered =
    query.length === 0 && activeTags.length === 0
      ? recipes
      : recipes.filter((recipe) => {
          const matchesQuery =
            query.length === 0 ||
            recipe.title.toLowerCase().includes(query) ||
            (recipe.description?.toLowerCase().includes(query) ?? false);

          const matchesTags =
            activeTags.length === 0 ||
            recipe.tags.some((tag) => activeTags.includes(tag));

          return matchesQuery && matchesTags;
        });

  filteredRecipesCache = {
    recipeOrderRef: state.recipeOrder,
    recipesByIdRef: state.recipesById,
    searchQuery,
    tagsKey,
    result: filtered,
  };

  return filteredRecipesCache.result;
};

export const selectReactionCounts =
  (recipeId: RecipeId) => (state: RecipesStoreState) => {
    const recipe = state.recipesById[recipeId];
    return recipe
      ? { likes: recipe.likes, dislikes: recipe.dislikes }
      : { likes: 0, dislikes: 0 };
  };
