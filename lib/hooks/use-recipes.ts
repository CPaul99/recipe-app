"use client";

import { useEffect, useRef } from "react";

import { merge, init, load, subscribe } from "../storage/recipes";
import { useRecipesStore } from "../stores/recipes-store";
import type { Recipe } from "../types/recipe";

export const useRecipes = (initialRecipes: Recipe[] = []) => {
  const isHydrated = useRecipesStore((state) => state.isHydrated);
  const initialRef = useRef(initialRecipes);

  useEffect(() => {
    initialRef.current = initialRecipes;
  }, [initialRecipes]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let unsubscribe: (() => void) | undefined;

    const hydrate = async () => {
      init();

      const persisted = await load();
      const storeState = useRecipesStore.getState();

      if (!storeState.isHydrated) {
        const merged = merge({ persisted, incoming: initialRef.current ?? [] });

        if (merged.length > 0) {
          storeState.setRecipes(merged);
        }

        storeState.markHydrated();
      }

      unsubscribe = subscribe(useRecipesStore);
    };

    void hydrate();

    return () => {
      unsubscribe?.();
    };
  }, []);

  return { isHydrated };
};
