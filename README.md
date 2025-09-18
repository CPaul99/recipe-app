# Recipe Manager

A recipe management application built with Next.js, TypeScript, and local data storage.

Features
- Search recipes by title and filter by tags
- Recipe editor with ingredients, steps, and metadata
- All data persists locally using IndexedDB - no server
- Works on desktop and layout is responsive for mobile

## 🔗 Repository

**GitHub**: https://github.com/CPaul99/recipe-app

**Clone**:
```bash
git clone https://github.com/CPaul99/recipe-app.git
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ or **Bun** (recommended for faster performance)
- Modern web browser with IndexedDB support (Chrome, Safari, Edge, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CPaul99/recipe-app.git
   cd recipe-app
   ```

2. **Install dependencies**
   ```bash
   # Using Bun (recommended)
   bun install

   # Or using npm
   npm install
   ```

3. **Start development server**
   ```bash
   # Using Bun
   bun dev

   # Or using npm
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

5. **Seed data**
   Run `make backend-seed` from terminal project root (recipe-app % make backend-seed). This will populate the app with example recipes.
   ```bash
   make backend-seed
   ```

6. **Load sample recipes**
   Navigate to [http://localhost:3000/seed](http://localhost:3000/seed) and click the "Load Sample Recipes" button to populate your app with 12 sample recipes.

## 🏗️ Architecture & Design Choices

### Tech Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components for consistent design
- **State Management**: Zustand for global state with normalized data structure
- **Data Persistence**: IndexedDB via idb-keyval for local-first storage
- **Forms**: React Hook Form with Zod validation for form handling
- **Icons**: Lucide React for consistent iconography

### Design

#### Data Flow
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   UI Components │◄──►│   Zustand Store  │◄──►│   IndexedDB Storage │
│                 │    │  (recipes-store) │    │   (idb-keyval)      │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
         ▲                       ▲                        ▲
         │                       │                        │
         ▼                       ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│ React Hook Form │    │   Custom Hooks   │    │  Persistence Layer  │
│   Validation    │    │  (use-recipes)   │    │     (storage/)      │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
```

#### Normalized State Management
```typescript
// State structure optimized for performance
{
  recipesById: Record<RecipeId, Recipe>,  // O(1) lookups
  recipeOrder: RecipeId[],                // Preserve user ordering
  filters: RecipeFilters                  // Current filter state
}
```
- **Why**: Efficient updates, prevents N+1 rendering issues
- **Benefits**: Fast filtering, optimistic updates, cache-friendly

#### Component Architecture
- **Route Groups**: `/public` and `/auth` for logical organization
- **Co-location**: Page-specific components in `_components/` folders
- **Shared UI**: Reusable components in `components/ui/` (shadcn/ui pattern)
- **Feature Modules**: Domain logic in `features/` directory

### Performance Optimizations
- **Memoized Selectors**: Expensive computations cached until dependencies change
- **Batch Updates**: Multiple state changes grouped in single render cycle
- **Optimistic Updates**: UI responds immediately, persistence happens asynchronously

### Type Safety & Validation
- **Runtime Validation**: Zod schemas validate all user input and storage data
- **Form Validation**: Client-side validation with helpful error messages

## 📁 Project Structure
```
recipe-app/
├── app/                   # Next.js App Router pages
│   ├── public/            # Public routes (browse, create)
│   ├── auth/              # Authentication routes
│   ├── api/               # API endpoints (seed data)
│   └── layout.tsx         # Root layout with providers
├── components/            # Reusable UI components
│   ├── layout/           # Layout-specific components
│   └── ui/               # shadcn/ui components
├── features/             # Feature-specific components
├── lib/                  # Core application logic
│   ├── hooks/           # Custom React hooks
│   ├── stores/          # Zustand state management
│   ├── storage/         # IndexedDB persistence
│   ├── types/           # TypeScript definitions
│   ├── validation/      # Zod schemas
│   └── utils.ts         # Utility functions
├── seed-data/           # Sample recipe images
└── public/              # Static assets
```

## 🔧 What I Would Improve With More Time

- **Testing**: Unit tests for utilities and core functions
- **Authentication**: Hook up auth with a provider like Firebase or self code
- **Server**: Actual backend Postgre17 and an S3 bucket for storage.
- **Redundancy check**: Go over a lot of the generated code and make sure no artifacts/redundant code is left over

## 🤝 Development

### Code Quality Tools
- **ESLint**: Code linting with React and accessibility rules
- **Prettier**: Consistent code formatting
- **Makefile**: Utility commands for development workflow

### Development Commands
```bash
make paths          # List all project files
make content <dir>  # Extract content from directories
make stagedp        # List staged files for commits
make backend-seed   # Generate sample recipe data
```

## 📄 License
MIT