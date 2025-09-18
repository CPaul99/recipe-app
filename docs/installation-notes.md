## NEXT.js

cosmo@Cosmos-MacBook-Pro desktop % bun create next-app@latest recipe-app --yes
Creating a new Next.js app in /Users/cosmo/Desktop/recipe-app.

Using bun.

Initializing project with template: app-tw

Installing dependencies:

- react
- react-dom
- next

Installing devDependencies:

- typescript
- @types/node
- @types/react
- @types/react-dom
- @tailwindcss/postcss
- tailwindcss

bun install v1.2.18 (0d4089ea)

- @tailwindcss/postcss@4.1.13
- @types/node@20.19.17 (v24.5.2 available)
- @types/react@19.1.13
- @types/react-dom@19.1.9
- tailwindcss@4.1.13
- typescript@5.9.2
- next@15.5.3
- react@19.1.0
- react-dom@19.1.0

53 packages installed [6.01s]

Blocked 1 postinstall. Run `bun pm untrusted` for details.
Initialized a git repository.

Success!

## Shadcn

cosmo@Cosmos-MacBook-Pro recipe-app % bunx --bun shadcn@latest init
✔ Preflight checks.
✔ Verifying framework. Found Next.js.
✔ Validating Tailwind CSS config. Found v4.
✔ Validating import alias.
✔ Which color would you like to use as the base color? › Neutral
✔ Writing components.json.
✔ Checking registry.
✔ Updating CSS variables in app/globals.css
✔ Installing dependencies.
✔ Created 1 file:

- lib/utils.ts

Success! Project initialization completed.
You may now add components.

cosmo@Cosmos-MacBook-Pro recipe-app %

## Zustand

cosmo@Cosmos-MacBook-Pro recipe-app % bun add zustand
bun add v1.2.18 (0d4089ea)

installed zustand@5.0.8

1 package installed [235.00ms]
cosmo@Cosmos-MacBook-Pro recipe-app %

## Zod

cosmo@Cosmos-MacBook-Pro recipe-app % bun add zod react-hook-form @hookform/resolvers
bun add v1.2.18 (0d4089ea)

installed zod@4.1.9
installed react-hook-form@7.62.0
installed @hookform/resolvers@5.2.2

4 packages installed [588.00ms]

## ESLint + Prettier

cosmo@Cosmos-MacBook-Pro recipe-app % bun add -d eslint prettier
bun add v1.2.18 (0d4089ea)

installed eslint@9.35.0 with binaries:

- eslint
  installed prettier@3.6.2 with binaries:
- prettier

86 packages installed [820.00ms]
cosmo@Cosmos-MacBook-Pro recipe-app %

## idb-keyval

cosmo@Cosmos-MacBook-Pro recipe-app % bun add idb-keyval
bun add v1.2.18 (0d4089ea)

installed idb-keyval@6.2.2

1 package installed [341.00ms]
cosmo@Cosmos-MacBook-Pro recipe-app %
