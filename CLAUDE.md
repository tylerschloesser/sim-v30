# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Package manager:** Use `bun` instead of `npm`
- **Type check:** `bun tsc -b` (project uses references, so `--noEmit` doesn't work)
- **Lint:** `bun run lint`
- **Build:** `bun run build`
- **Dev server:** Do not run `bun run dev` yourself - user manages this

## Architecture

React + TypeScript + Vite simulation app with a fixed 60Hz tick loop.

### Routing

TanStack Router with file-based routing in `src/routes/`. Route tree is auto-generated in `src/routeTree.gen.ts` - do not edit manually.

### State Management

Global state using React Context + Immer (`use-immer`):

- `src/state/AppStateContext.ts` - `AppState` type and context definition
- `src/state/AppState.tsx` - `AppStateProvider` component
- `src/hooks/useAppState.ts` - `useAppState()` hook to access state

State is updated via immer drafts: `updateState(draft => { draft.tick += 1 })`

### Tick System

`src/hooks/useTicker.ts` - Frame-independent 60Hz tick loop using `requestAnimationFrame`. Accumulates time and batches tick updates (e.g., 2 ticks per frame at 30fps). Called in `__root.tsx` with `updateState` passed as parameter.

## Code Style

- Use `import type` for type-only imports (required by `verbatimModuleSyntax`)
- Keep React components and hooks in separate files for fast refresh (lint enforced)
