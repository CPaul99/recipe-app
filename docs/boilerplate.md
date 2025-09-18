# Boilerplate code setup

Here is the boilerplate code setup that was done prior to starting the challenge. I am using bun because it is fast. 😎

## Commands

### bun create next-app@latest recipe-app --yes

NEXT.js, TypeScript, Tailwind, App Router, Turbopack

### recipe-app % bunx --bun shadcn@latest init

shadcn/ui

- Why? Clean ui components and color system.

### recipe-app % bun add zustand

Zustand
-Why? Global state management.

### recipe-app % bun add zod react-hook-form @hookform/resolvers

Zod + React Hook Form + Resolvers

- Why? Zod for schema validation, React Hook Form for form state, and resolver to link the two.

### recipe-app % bun add -d eslint prettier

ESLint + Prettier

- Why? Code quality & formatting.

## Makefile

Added Makefile with 3 useful commands for LLM.

- 'make paths' lists paths in project and adds to .txt file scrap/txt/paths.txt
- 'make stagedp' lists paths of staged files and adds to .txt file scrap/txt/staged_paths.txt
- 'make content' copies content of given folder paths to a .txt file scrap/txt/contents.txt
  scrap/txt/ is gitignored
