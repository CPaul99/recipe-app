import { createStore, get, set } from "idb-keyval";
import type { StoreApi, UseBoundStore } from "zustand";

import type { Recipe, RecipeId } from "../types/recipe";
import type { RecipesStoreState } from "../stores/recipes-store";

const DB_NAME = "recipe-app";
const STORE_NAME = "recipes";
const STORAGE_KEY = "recipes-state";
const STORAGE_VERSION = 1;

export type PersistedRecipesSnapshot = {
  version: number;
  recipeOrder: RecipeId[];
  recipes: Recipe[];
};

export type PersistedRecipesPayload = PersistedRecipesSnapshot & {
  updatedAt: string;
};

let storage: ReturnType<typeof createStore> | null = null;

const resolveStore = () => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!storage) {
    storage = createStore(DB_NAME, STORE_NAME);
  }

  return storage;
};

export const init = () => {
  return resolveStore();
};

export const load = async (): Promise<PersistedRecipesPayload | null> => {
  const store = resolveStore();

  if (!store) {
    return null;
  }

  try {
    const payload = await get<PersistedRecipesPayload>(STORAGE_KEY, store);

    if (!payload) {
      return null;
    }

    if (payload.version !== STORAGE_VERSION) {
      return null;
    }

    return payload;
  } catch (error) {
    console.warn("[recipes storage] Failed to load recipes", error);
    return null;
  }
};

export const merge = ({
  persisted,
  incoming = [],
}: {
  persisted: PersistedRecipesPayload | null;
  incoming?: Recipe[];
}): Recipe[] => {
  if (!persisted) {
    return incoming;
  }

  const recipeMap = new Map<RecipeId, Recipe>();

  for (const recipe of incoming) {
    recipeMap.set(recipe.id, recipe);
  }

  for (const recipe of persisted.recipes) {
    recipeMap.set(recipe.id, recipe);
  }

  if (persisted.recipeOrder?.length) {
    const ordered: Recipe[] = [];

    for (const id of persisted.recipeOrder) {
      const recipe = recipeMap.get(id);
      if (!recipe) continue;
      ordered.push(recipe);
      recipeMap.delete(id);
    }

    if (recipeMap.size > 0) {
      ordered.push(...recipeMap.values());
    }

    return ordered;
  }

  return Array.from(recipeMap.values());
};

type BoundStore = UseBoundStore<StoreApi<RecipesStoreState>>;

type StorageHandle = ReturnType<typeof createStore>;

const snapshotState = (state: RecipesStoreState): PersistedRecipesSnapshot => ({
  version: STORAGE_VERSION,
  recipeOrder: [...state.recipeOrder],
  recipes: state.recipeOrder
    .map((id) => state.recipesById[id])
    .filter((recipe): recipe is Recipe => Boolean(recipe)),
});

const snapshotsEqual = (
  left: PersistedRecipesSnapshot,
  right: PersistedRecipesSnapshot,
) => {
  if (left === right) {
    return true;
  }

  if (left.version !== right.version) {
    return false;
  }

  if (left.recipeOrder.length !== right.recipeOrder.length) {
    return false;
  }

  for (let index = 0; index < left.recipeOrder.length; index += 1) {
    if (left.recipeOrder[index] !== right.recipeOrder[index]) {
      return false;
    }
  }

  if (left.recipes.length !== right.recipes.length) {
    return false;
  }

  for (let index = 0; index < left.recipes.length; index += 1) {
    const leftRecipe = left.recipes[index];
    const rightRecipe = right.recipes[index];

    if (!rightRecipe) {
      return false;
    }

    if (leftRecipe.id !== rightRecipe.id) {
      return false;
    }

    if (leftRecipe.updatedAt !== rightRecipe.updatedAt) {
      return false;
    }

    if (leftRecipe.likes !== rightRecipe.likes) {
      return false;
    }

    if (leftRecipe.dislikes !== rightRecipe.dislikes) {
      return false;
    }
  }

  return true;
};

const persistSnapshot = (
  snapshot: PersistedRecipesSnapshot,
  storageStore: StorageHandle,
) => {
  const payload: PersistedRecipesPayload = {
    ...snapshot,
    updatedAt: new Date().toISOString(),
  };

  void set(STORAGE_KEY, payload, storageStore).catch((error) => {
    console.warn("[recipes storage] Failed to persist recipes", error);
  });
};

export const subscribe = (store: BoundStore) => {
  const storageStore = resolveStore();

  if (!storageStore) {
    return () => {};
  }

  const state = store.getState();
  if (state.isHydrated) {
    persistSnapshot(snapshotState(state), storageStore);
  }

  return store.subscribe((nextState, previousState) => {
    if (!nextState.isHydrated) {
      return;
    }

    const nextSnapshot = snapshotState(nextState);
    const prevSnapshot = snapshotState(previousState);

    if (snapshotsEqual(nextSnapshot, prevSnapshot)) {
      return;
    }

    persistSnapshot(nextSnapshot, storageStore);
  });
};
