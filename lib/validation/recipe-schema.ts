import { z } from "zod";

import type { RecipeCreateInput } from "@/lib/types/recipe";
import { RecipeTag } from "@/lib/types/recipe";
import { generateId } from "@/lib/utils";

const MAX_TITLE_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 280;
const MAX_NOTES_LENGTH = 500;
const MAX_TEXT_FIELD_LENGTH = 120;
const MAX_STEP_LENGTH = 600;
const MAX_TIME_MINUTES = 1440;
const MAX_IMAGE_URL_LENGTH = 100_000;

const optionalText = (max: number, message?: string) =>
  z
    .union([z.string(), z.undefined()])
    .transform((value) => {
      if (value === undefined) {
        return undefined;
      }

      const trimmed = value.trim();
      return trimmed.length === 0 ? undefined : trimmed;
    })
    .refine(
      (value) => value === undefined || value.length <= max,
      message ?? `Must be ${max} characters or less`,
    );

const optionalNumericString = (params?: {
  max?: number;
  min?: number;
  message?: string;
}) =>
  z
    .union([z.string(), z.undefined()])
    .transform((value) => {
      if (value === undefined) {
        return undefined;
      }

      const trimmed = value.trim();
      return trimmed.length === 0 ? undefined : trimmed;
    })
    .superRefine((value, ctx) => {
      if (value === undefined) {
        return;
      }

      if (!/^[0-9]+$/.test(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: params?.message ?? "Must be a whole number",
        });
        return;
      }

      const numericValue = Number(value);

      if (params?.min !== undefined && numericValue < params.min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Must be at least ${params.min}`,
        });
      }

      if (params?.max !== undefined && numericValue > params.max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Must be ${params.max} or less`,
        });
      }
    });

const ingredientSchema = z.object({
  id: z.string().min(1, "Missing ingredient identifier"),
  name: z
    .string()
    .trim()
    .min(1, "Ingredient name is required")
    .max(
      MAX_TEXT_FIELD_LENGTH,
      `Ingredient name must be ${MAX_TEXT_FIELD_LENGTH} characters or less`,
    ),
  quantity: optionalText(
    MAX_TEXT_FIELD_LENGTH,
    `Quantity must be ${MAX_TEXT_FIELD_LENGTH} characters or less`,
  ),
  preparation: optionalText(
    MAX_TEXT_FIELD_LENGTH,
    `Preparation must be ${MAX_TEXT_FIELD_LENGTH} characters or less`,
  ),
  optional: z.boolean().optional().default(false),
});

const stepSchema = z.object({
  id: z.string().min(1, "Missing step identifier"),
  order: z.number().int().min(1, "Step order must be at least 1"),
  instruction: z
    .string()
    .trim()
    .min(1, "Step instruction is required")
    .max(
      MAX_STEP_LENGTH,
      `Step instruction must be ${MAX_STEP_LENGTH} characters or less`,
    ),
  timerMinutes: optionalNumericString({
    max: MAX_TIME_MINUTES,
    message: `Timer must be ${MAX_TIME_MINUTES} minutes or less`,
  }),
});

export const recipeFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(
        MAX_TITLE_LENGTH,
        `Title must be ${MAX_TITLE_LENGTH} characters or less`,
      ),
    description: optionalText(
      MAX_DESCRIPTION_LENGTH,
      `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`,
    ),
    author: optionalText(
      MAX_TEXT_FIELD_LENGTH,
      `Author must be ${MAX_TEXT_FIELD_LENGTH} characters or less`,
    ),
    imageUrl: optionalText(MAX_IMAGE_URL_LENGTH, "Image reference is too long"),
    tags: z
      .array(z.nativeEnum(RecipeTag))
      .min(0)
      .refine((tags) => new Set(tags).size === tags.length, {
        message: "Tags must be unique",
      }),
    ingredients: z
      .array(ingredientSchema)
      .min(1, "Add at least one ingredient")
      .max(25, "Too many ingredients"),
    steps: z
      .array(stepSchema)
      .min(1, "Add at least one step")
      .max(25, "Too many steps"),
    notes: optionalText(
      MAX_NOTES_LENGTH,
      `Notes must be ${MAX_NOTES_LENGTH} characters or less`,
    ),
    servings: optionalNumericString({
      min: 1,
      message: "Servings must be a whole number",
    }),
    prepTimeMinutes: optionalNumericString({
      min: 0,
      max: MAX_TIME_MINUTES,
      message: "Prep time must be a whole number",
    }),
    cookTimeMinutes: optionalNumericString({
      min: 0,
      max: MAX_TIME_MINUTES,
      message: "Cook time must be a whole number",
    }),
    totalTimeMinutes: optionalNumericString({
      min: 0,
      max: MAX_TIME_MINUTES,
      message: "Total time must be a whole number",
    }),
  })
  .superRefine((values, ctx) => {
    const numbers = [
      values.prepTimeMinutes,
      values.cookTimeMinutes,
      values.totalTimeMinutes,
    ].map((value) => (value ? Number(value) : undefined));

    const [prep, cook, total] = numbers;

    if (total !== undefined && prep !== undefined && cook !== undefined) {
      if (total < prep + cook) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["totalTimeMinutes"],
          message: "Total time should be greater than or equal to prep + cook",
        });
      }
    }
  });

export type RecipeFormValues = z.input<typeof recipeFormSchema>;

export const createEmptyIngredient =
  (): RecipeFormValues["ingredients"][number] => ({
    id: generateId(),
    name: "",
    quantity: "",
    preparation: "",
    optional: false,
  });

export const createEmptyStep = (
  order: number,
): RecipeFormValues["steps"][number] => ({
  id: generateId(),
  order,
  instruction: "",
  timerMinutes: "",
});

export const createRecipeFormDefaults = (): RecipeFormValues => ({
  title: "",
  description: undefined,
  author: undefined,
  imageUrl: undefined,
  tags: [],
  ingredients: [createEmptyIngredient()],
  steps: [createEmptyStep(1)],
  notes: undefined,
  servings: "",
  prepTimeMinutes: "",
  cookTimeMinutes: "",
  totalTimeMinutes: "",
});

const sanitizeText = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
};

const sanitizeNumber = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  if (!/^[0-9]+$/.test(value)) {
    return undefined;
  }

  return Number(value);
};

const sanitizeBoolean = (value: boolean | undefined) => value ?? false;

export const recipeFormValuesToCreateInput = (
  values: RecipeFormValues,
): RecipeCreateInput => ({
  title: values.title.trim(),
  description: sanitizeText(values.description),
  author: sanitizeText(values.author),
  imageUrl: sanitizeText(values.imageUrl),
  tags: Array.from(new Set(values.tags)),
  ingredients: values.ingredients.map((ingredient) => ({
    id: ingredient.id || generateId(),
    name: ingredient.name.trim(),
    quantity: sanitizeText(ingredient.quantity),
    preparation: sanitizeText(ingredient.preparation),
    optional: sanitizeBoolean(ingredient.optional),
  })),
  steps: values.steps.map((step, index) => ({
    id: step.id || generateId(),
    instruction: step.instruction.trim(),
    order: index + 1,
    timerMinutes: sanitizeNumber(step.timerMinutes),
  })),
  notes: sanitizeText(values.notes),
  servings: sanitizeNumber(values.servings),
  prepTimeMinutes: sanitizeNumber(values.prepTimeMinutes),
  cookTimeMinutes: sanitizeNumber(values.cookTimeMinutes),
  totalTimeMinutes: sanitizeNumber(values.totalTimeMinutes),
});
