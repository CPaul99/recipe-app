# Recipe App - Project Structure & Data Flow

## Directory Structure

```
recipe-app/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Auth group routes
│   │   └── login/page.tsx        # Login/signup page
│   ├── (public)/                 # Public group routes
│   │   ├── browse/               # Recipe browsing
│   │   │   ├── _components/      # Browse-specific components
│   │   │   └── page.tsx
│   │   └── create/               # Recipe creation
│   │       ├── _components/      # Create-specific components
│   │       └── page.tsx
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/                   # Reusable UI components
│   ├── layout/                   # Layout-specific components
│   │   ├── app-providers.tsx     # Global providers wrapper
│   │   ├── header.tsx            # Navigation header
│   │   ├── footer.tsx            # Site footer
│   │   └── mobile-drawer.tsx     # Mobile navigation
│   └── ui/                       # shadcn/ui components
├── features/                     # Feature-specific components
│   └── layout/
│       └── shell-layout.tsx      # Main application shell
├── lib/                          # Core application logic
│   ├── constants/                # Application constants
│   ├── hooks/                    # Custom React hooks
│   ├── storage/                  # Data persistence layer
│   ├── stores/                   # State management
│   ├── types/                    # TypeScript type definitions
│   ├── validation/               # Zod schemas
│   └── utils.ts                  # Utility functions
├── docs/                         # Documentation
├── seed-data/                    # Static recipe images
└── public/                       # Static assets
```

## Data Architecture

### Core Data Types

The application centers around the `Recipe` entity defined in `lib/types/recipe.ts`:

```typescript
interface Recipe {
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
```

Supporting types include:
- `Ingredient`: Recipe ingredients with quantities and preparation notes
- `Step`: Cooking instructions with optional timers
- `RecipeTag`: Enumerated categories (breakfast, vegan, quick, etc.)
- `RecipeFilters`: Search and filtering criteria

### Data Flow Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   UI Components │◄──►│   Zustand Store  │◄──►│   IndexedDB Storage │
│                 │    │  (recipes-store) │    │   (idb-keyval)      │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
         ▲                       ▲                        ▲
         │                       │                        │
         ▼                       ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│ React Hook Form │    │   Custom Hooks   │    │  Persistence Layer │
│   Validation    │    │  (use-recipes)   │    │     (storage/)      │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
```

## State Management

### Zustand Store (`lib/stores/recipes-store.ts`)

The central state management uses Zustand with the following state structure:

```typescript
type RecipesStoreState = {
  // Data
  recipesById: Record<RecipeId, Recipe>;
  recipeOrder: RecipeId[];
  filters: RecipeFilters;
  isHydrated: boolean;

  // Actions
  setRecipes, addRecipe, upsertRecipe, updateRecipe, removeRecipe,
  likeRecipe, dislikeRecipe, resetReactions,
  setFilters, toggleTag, resetFilters, setSearchQuery,
  markHydrated
};
```

Key patterns:
- **Normalized State**: Recipes stored as `recipesById` map with separate `recipeOrder` array
- **Immutable Updates**: All state changes create new objects
- **Optimistic Updates**: UI updates immediately, persistence happens asynchronously
- **Caching**: Computed values (filtered recipes, reaction counts) are cached for performance

### Custom Hooks (`lib/hooks/use-recipes.ts`)

The `useRecipes` hook orchestrates:
1. **Hydration**: Loads persisted data from IndexedDB on app startup
2. **Merging**: Combines persisted recipes with any initial data
3. **Subscription**: Sets up automatic persistence on state changes

## Data Persistence

### Storage Layer (`lib/storage/recipes.ts`)

Uses IndexedDB via `idb-keyval` for client-side persistence:

```typescript
type PersistedRecipesPayload = {
  version: number;           // Schema versioning
  recipeOrder: RecipeId[];   // Recipe ordering
  recipes: Recipe[];         // Full recipe data
  updatedAt: string;         // Last persistence timestamp
};
```

Key features:
- **Versioned Storage**: Schema version checking for data migrations
- **Optimistic Persistence**: Only persists when actual changes occur
- **Merge Strategy**: Combines persisted and incoming data intelligently
- **Error Handling**: Graceful fallbacks when storage fails

### Storage Flow

1. **App Initialization**:
   - `init()` creates IndexedDB store
   - `load()` retrieves persisted data
   - `merge()` combines with initial recipes
   - Store hydration completes

2. **Runtime Updates**:
   - User actions update Zustand store
   - Storage subscriber detects changes
   - `persistSnapshot()` saves to IndexedDB asynchronously

3. **Data Consistency**:
   - Snapshot comparison prevents unnecessary writes
   - Recipe order preservation maintains user experience
   - Timestamp tracking for conflict resolution

## Component Architecture

### Layout Structure

```
RootLayout (app/layout.tsx)
├── AppProviders (components/layout/app-providers.tsx)
│   └── useRecipes hook initialization
└── ShellLayout (features/layout/shell-layout.tsx)
    ├── Header (components/layout/header.tsx)
    ├── Main Content Area
    │   └── Page Components
    └── Footer (components/layout/footer.tsx)
```

### Route Organization

- **Route Groups**: `auth` and `public` for logical organization
- **Co-located Components**: Page-specific components in `_components/` folders
- **Shared Components**: Reusable UI components in `components/ui/`
- **Feature Components**: Domain-specific logic in `features/`

## Performance Optimizations

### State Management
- **Selector Caching**: Expensive computations cached and invalidated intelligently
- **Reference Equality**: Shallow comparisons prevent unnecessary re-renders
- **Batch Updates**: Multiple state changes batched in single update cycle

### Storage
- **Change Detection**: Only persists when actual data changes occur
- **Compression**: Efficient serialization of recipe data
- **Lazy Loading**: Storage operations don't block UI interactions

### Rendering
- **Component Splitting**: Large components split into focused sub-components
- **Memo Patterns**: React.memo and useMemo for expensive computations
- **Virtualization Ready**: Architecture supports future virtual scrolling

## Development Patterns

### Code Organization
- **Domain-Driven**: Features organized by business domain
- **Type Safety**: Comprehensive TypeScript coverage
- **Validation**: Zod schemas for runtime type checking
- **Separation of Concerns**: Clear boundaries between UI, state, and persistence

### Error Handling
- **Graceful Degradation**: App works without persistence
- **User Feedback**: Clear error states and loading indicators
- **Development Tools**: Console warnings for debugging