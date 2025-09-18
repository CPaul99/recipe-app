"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_RECIPE_IMAGE } from "@/lib/constants/images";
import { cn } from "@/lib/utils";
import { ALL_RECIPE_TAGS, RecipeTag } from "@/lib/types/recipe";
import {
  createEmptyIngredient,
  createEmptyStep,
  createRecipeFormDefaults,
  recipeFormSchema,
  type RecipeFormValues,
} from "@/lib/validation/recipe-schema";

const MAX_INGREDIENTS = 25;
const MAX_STEPS = 25;

type RecipeFormProps = {
  onSubmit: (values: RecipeFormValues) => void | Promise<void>;
  onPreviewChange?: (values: RecipeFormValues) => void;
  isStoreReady?: boolean;
};

const toDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => {
      reject(reader.error ?? new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });

export function RecipeForm({
  onSubmit,
  onPreviewChange,
  isStoreReady = true,
}: RecipeFormProps) {
  const defaultValues = useMemo(() => createRecipeFormDefaults(), []);
  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    setError,
    clearErrors,
    getValues,
    formState,
  } = form;

  const { errors, isSubmitting, isValid } = formState;

  const ingredientFields = useFieldArray({
    control,
    name: "ingredients",
  });

  const stepFields = useFieldArray({
    control,
    name: "steps",
  });

  const [uploadedImageName, setUploadedImageName] = useState<
    string | undefined
  >();
  const watchedImageValue = watch("imageUrl");
  const imageValue =
    typeof watchedImageValue === "string"
      ? watchedImageValue.trim()
      : undefined;
  const previewImageUrl =
    imageValue && imageValue.length > 0 ? imageValue : DEFAULT_RECIPE_IMAGE;
  const isUsingFallbackImage = imageValue === DEFAULT_RECIPE_IMAGE;

  const activeTags = watch("tags");

  useEffect(() => {
    onPreviewChange?.(form.getValues());
  }, [form, onPreviewChange]);

  useEffect(() => {
    const subscription = watch(() => {
      onPreviewChange?.(form.getValues());
    });

    return () => subscription.unsubscribe();
  }, [watch, form, onPreviewChange]);

  const reindexSteps = useCallback(() => {
    const nextSteps = getValues("steps");
    nextSteps.forEach((_, index) => {
      setValue(`steps.${index}.order`, index + 1, {
        shouldDirty: false,
        shouldTouch: false,
      });
    });
  }, [getValues, setValue]);

  const addIngredient = () => {
    if (ingredientFields.fields.length >= MAX_INGREDIENTS) {
      return;
    }

    ingredientFields.append(createEmptyIngredient());
  };

  const removeIngredient = (index: number) => {
    if (ingredientFields.fields.length <= 1) {
      return;
    }

    ingredientFields.remove(index);
  };

  const addStep = () => {
    if (stepFields.fields.length >= MAX_STEPS) {
      return;
    }

    const nextOrder = getValues("steps").length + 1;
    stepFields.append(createEmptyStep(nextOrder));
  };

  const removeStep = (index: number) => {
    if (stepFields.fields.length <= 1) {
      return;
    }

    stepFields.remove(index);
    queueMicrotask(reindexSteps);
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setUploadedImageName(undefined);
      clearErrors("imageUrl");
      setValue("imageUrl", undefined, {
        shouldDirty: true,
        shouldTouch: true,
      });
      onPreviewChange?.(form.getValues());
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("imageUrl", {
        type: "manual",
        message: "Please select an image file",
      });
      return;
    }

    try {
      const dataUrl = await toDataUrl(file);
      clearErrors("imageUrl");
      setUploadedImageName(file.name);
      setValue("imageUrl", dataUrl, {
        shouldDirty: true,
        shouldTouch: true,
      });
      onPreviewChange?.(form.getValues());
    } catch (error) {
      console.error(error);
      setError("imageUrl", {
        type: "manual",
        message: "Unable to read image. Try a smaller file.",
      });
    }

    event.target.value = "";
  };

  const clearImage = () => {
    setUploadedImageName(undefined);
    clearErrors("imageUrl");
    setValue("imageUrl", undefined, {
      shouldDirty: true,
      shouldTouch: true,
    });
    onPreviewChange?.(form.getValues());
  };

  const applyFallbackImage = () => {
    setUploadedImageName(undefined);
    clearErrors("imageUrl");
    setValue("imageUrl", DEFAULT_RECIPE_IMAGE, {
      shouldDirty: true,
      shouldTouch: true,
    });
    onPreviewChange?.(form.getValues());
  };

  const toggleTag = (tag: RecipeTag) => {
    const current = getValues("tags");
    const hasTag = current.includes(tag);
    const next = hasTag
      ? current.filter((existing) => existing !== tag)
      : [...current, tag];

    setValue("tags", next, { shouldDirty: true, shouldTouch: true });
    onPreviewChange?.(form.getValues());
  };

  const onValidSubmit = handleSubmit(async (values) => {
    if (!isStoreReady) {
      return;
    }

    await onSubmit(values);

    const nextDefaults = createRecipeFormDefaults();
    reset(nextDefaults);
    setUploadedImageName(undefined);
    onPreviewChange?.(nextDefaults);
  });

  const imageError = errors.imageUrl?.message;
  const submitDisabled = isSubmitting || !isValid || !isStoreReady;
  const submitLabel = !isStoreReady
    ? "Preparing storage..."
    : isSubmitting
      ? "Saving..."
      : "Save recipe";

  return (
    <FormProvider {...form}>
      <form className="space-y-8" onSubmit={onValidSubmit} noValidate>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Recipe details</h2>
          <p className="text-sm text-muted-foreground">
            Add the core information for your recipe. Required fields are marked
            with an asterisk (*).
          </p>
        </div>

        <div className="grid gap-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="title">
                Title*
              </label>
              <Input
                id="title"
                placeholder="Grandma's lasagna"
                {...register("title")}
              />
              {errors.title ? (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="description">
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Share a short story or helpful context."
                {...register("description")}
              />
              {errors.description ? (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="author">
                Author
              </label>
              <Input
                id="author"
                placeholder="Your name or inspiration"
                {...register("author")}
              />
              {errors.author ? (
                <p className="text-sm text-destructive">
                  {errors.author.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Tags</label>
              <div className="flex flex-wrap gap-2">
                {ALL_RECIPE_TAGS.map((tag) => {
                  const isActive = activeTags.includes(tag);
                  return (
                    <Button
                      key={tag}
                      type="button"
                      size="sm"
                      variant={isActive ? "default" : "outline"}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "capitalize",
                        !isActive && "text-muted-foreground",
                      )}
                    >
                      {tag.replace(/-/g, " ")}
                    </Button>
                  );
                })}
              </div>
              {errors.tags ? (
                <p className="text-sm text-destructive">
                  {errors.tags.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="image-upload">
                Image upload
              </label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {uploadedImageName ? (
                <p className="text-sm text-muted-foreground">
                  Selected: {uploadedImageName}
                </p>
              ) : null}
              {imageError ? (
                <p className="text-sm text-destructive">{imageError}</p>
              ) : null}
              <div className="flex flex-wrap items-center gap-2">
                {imageValue ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-fit px-2 text-xs"
                    onClick={clearImage}
                  >
                    Remove image
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={applyFallbackImage}
                  disabled={isUsingFallbackImage}
                >
                  Use fallback image
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-md border bg-muted">
                <img
                  src={previewImageUrl}
                  alt={
                    uploadedImageName
                      ? `Preview for ${uploadedImageName}`
                      : "Recipe image preview"
                  }
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {imageValue
                  ? isUsingFallbackImage
                    ? "Fallback placeholder will appear on your recipe card."
                    : "This image preview updates instantly and will be saved with your recipe."
                  : "No image selected. The fallback placeholder will be shown until you add one."}
              </p>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="imageUrl">
                Image URL
              </label>
              <Input
                id="imageUrl"
                placeholder="https://images.example.com/dish.jpg"
                {...register("imageUrl")}
              />
              {errors.imageUrl && !imageError ? (
                <p className="text-sm text-destructive">
                  {errors.imageUrl.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Servings & timing</label>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="grid gap-1">
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="Servings"
                    {...register("servings")}
                  />
                  {errors.servings ? (
                    <p className="text-sm text-destructive">
                      {errors.servings.message}
                    </p>
                  ) : null}
                </div>
                <div className="grid gap-1">
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="Prep (minutes)"
                    {...register("prepTimeMinutes")}
                  />
                  {errors.prepTimeMinutes ? (
                    <p className="text-sm text-destructive">
                      {errors.prepTimeMinutes.message}
                    </p>
                  ) : null}
                </div>
                <div className="grid gap-1">
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="Cook (minutes)"
                    {...register("cookTimeMinutes")}
                  />
                  {errors.cookTimeMinutes ? (
                    <p className="text-sm text-destructive">
                      {errors.cookTimeMinutes.message}
                    </p>
                  ) : null}
                </div>
                <div className="grid gap-1">
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="Total (minutes)"
                    {...register("totalTimeMinutes")}
                  />
                  {errors.totalTimeMinutes ? (
                    <p className="text-sm text-destructive">
                      {errors.totalTimeMinutes.message}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Ingredients*</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addIngredient}
                disabled={ingredientFields.fields.length >= MAX_INGREDIENTS}
              >
                Add ingredient
              </Button>
            </div>
            <div className="space-y-4">
              {ingredientFields.fields.map((field, index) => {
                const fieldErrors = errors.ingredients?.[index];
                return (
                  <div key={field.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-medium">
                        Ingredient {index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeIngredient(index)}
                        disabled={ingredientFields.fields.length <= 1}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Input
                          placeholder="Ingredient name*"
                          {...register(`ingredients.${index}.name` as const)}
                        />
                        {fieldErrors?.name ? (
                          <p className="text-sm text-destructive">
                            {fieldErrors.name.message}
                          </p>
                        ) : null}
                      </div>
                      <div>
                        <Input
                          placeholder="Quantity"
                          {...register(
                            `ingredients.${index}.quantity` as const,
                          )}
                        />
                        {fieldErrors?.quantity ? (
                          <p className="text-sm text-destructive">
                            {fieldErrors.quantity.message}
                          </p>
                        ) : null}
                      </div>
                      <div>
                        <Input
                          placeholder="Preparation"
                          {...register(
                            `ingredients.${index}.preparation` as const,
                          )}
                        />
                        {fieldErrors?.preparation ? (
                          <p className="text-sm text-destructive">
                            {fieldErrors.preparation.message}
                          </p>
                        ) : null}
                      </div>
                      <div className="sm:col-span-2">
                        <label className="flex items-center gap-2 text-sm">
                          <Controller
                            control={control}
                            name={`ingredients.${index}.optional` as const}
                            render={({ field: controllerField }) => (
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border border-input"
                                checked={controllerField.value ?? false}
                                onChange={(event) =>
                                  controllerField.onChange(event.target.checked)
                                }
                              />
                            )}
                          />
                          Optional ingredient
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Steps*</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addStep}
                disabled={stepFields.fields.length >= MAX_STEPS}
              >
                Add step
              </Button>
            </div>
            <div className="space-y-4">
              {stepFields.fields.map((field, index) => {
                const fieldErrors = errors.steps?.[index];
                return (
                  <div key={field.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-medium">
                        Step {index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStep(index)}
                        disabled={stepFields.fields.length <= 1}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="mt-3 grid gap-3">
                      <Textarea
                        placeholder="Describe the step*"
                        {...register(`steps.${index}.instruction` as const)}
                      />
                      {fieldErrors?.instruction ? (
                        <p className="text-sm text-destructive">
                          {fieldErrors.instruction.message}
                        </p>
                      ) : null}
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="Timer (minutes)"
                        {...register(`steps.${index}.timerMinutes` as const)}
                      />
                      {fieldErrors?.timerMinutes ? (
                        <p className="text-sm text-destructive">
                          {fieldErrors.timerMinutes.message}
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="notes">
              Notes
            </label>
            <Textarea
              id="notes"
              placeholder="Add serving suggestions or reminders."
              {...register("notes")}
            />
            {errors.notes ? (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={submitDisabled}>
            {submitLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const nextDefaults = createRecipeFormDefaults();
              reset(nextDefaults);
              setUploadedImageName(undefined);
              onPreviewChange?.(nextDefaults);
            }}
          >
            Reset
          </Button>
          {!isStoreReady ? (
            <p className="text-sm text-muted-foreground">
              Recipes are still syncing. Saving is disabled until the store is
              ready.
            </p>
          ) : null}
        </div>
      </form>
    </FormProvider>
  );
}
