# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@42.nl/react-flash-messages` is a UI-agnostic React library for flash message (notification/toast) state management. It provides a pub/sub store and React hooks—no UI components. Maintained by 42BV.

## Commands

```bash
# Development (watch mode with coverage)
npm start

# Run all checks (lint + type check + tests with coverage)
npm test

# Individual checks
npm run lint                # ESLint (max-warnings=0)
npm run test:ts             # TypeScript type checking (tsc --noEmit)
npm run test:coverage       # Jest with coverage (100% threshold enforced)

# Run a single test file
npx jest tests/actions.test.ts

# Run tests matching a pattern
npx jest --testPathPattern="hooks"

# Build (clean + compile to /lib)
npm run tsc

# Release to npm
npm run release
```

## Architecture

The library follows a **pub/sub pattern** with a centralized singleton service:

```
src/
├── service.ts    # Core: subscriber registry, state, notify loop
├── actions.ts    # Public API: addError/Warning/Success/Info/Apocalypse, removeFlashMessage
├── hooks.ts      # useFlashMessages — subscribes to service, returns current messages
├── provider.tsx   # FlashMessagesProvider — optional Context API alternative to hook
├── models.ts     # TypeScript types (FlashMessage<Data>, FlashMessageType, etc.)
└── index.ts      # Re-exports all public API
```

**Data flow**: `addFlashMessage()` → service stores message + sets auto-remove timeout → notifies all subscribers → `useFlashMessages` hook re-renders consuming components.

**Key design decisions**:
- `FlashMessage<Data>` uses a generic for custom metadata attached to messages
- Messages auto-remove via `setTimeout` after type-specific durations (ERROR=10s, WARNING=7s, SUCCESS=2s, INFO=5s, APOCALYPSE=never)
- `onClick`/`onRemove` callbacks are wrapped to inject the FlashMessage instance as first argument
- Removal reason tracking: `'duration-elapsed'` vs `'manually-removed'`
- Sequential numeric IDs via incrementing counter

## Conventions

- **100% test coverage** required (branches, functions, lines, statements)
- **Zero lint warnings** allowed (`--max-warnings=0`)
- **ESLint v9 flat config** in `eslint.config.mjs` (ESM file since project is CommonJS)
- **Prettier**: single quotes, no trailing commas
- **TypeScript strict mode** enabled
- **Pre-commit hook** (husky + lint-staged) auto-formats staged files
- Tests use `@testing-library/react` and fake timers for duration testing
- No runtime dependencies; React is a peer dependency
