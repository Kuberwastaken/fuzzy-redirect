# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2025-11-23

### Added
- **Security**: Open redirect protection via `isSafeRoute` checks (blocks protocol-relative URLs like `//evil.com` and absolute URLs).
- **Security**: Route exclusion support via `exclude` option in `FuzzyMatchOptions`.
- **Performance**: Internal LRU cache (500 entries) for route matching results.
- **Performance**: Optimized Levenshtein algorithm with 2-row array approach.
- **API**: `onRedirect` callback in `FuzzyMatchOptions` for tracking/analytics.
- **API**: `enabled` prop for all hooks to conditionally disable redirects.
- **Framework**: Infinite redirect loop protection in React hook (max 3 redirects).
- **Framework**: `'use client'` directive for Next.js App Router compatibility.
- **Type Safety**: Input validation in `extractRoutes` utility.
- **Type Safety**: Error boundaries (try/catch) in all hooks.
- **CLI**: `--exclude` flag to filter routes during generation.
- **CLI**: `--include-dynamic` flag to include dynamic routes like `[id]`.

### Fixed
- Correct Levenshtein distance calculation (was incorrectly returning 2 instead of 3 for some inputs).

## [1.0.1] - 2025-11-23

### Fixed
-   Preserve query parameters and hash fragments during redirect.
-   Fix double execution of fuzzy matching logic in React hook.
-   Add URL decoding to handle encoded characters (e.g., `%20`).
-   Ensure correct usage of `next/navigation` router.

## [1.0.0] - 2025-11-23

### Added
-   Initial release.
-   Core fuzzy matching logic using Levenshtein distance.
-   `useFuzzyRedirect` hook for React Router.
-   `useFuzzyRedirect` hook for Next.js Pages Router.
-   `useAppFuzzyRedirect` hook for Next.js App Router.
-   CLI tool `fuzzy-redirect-gen` to auto-generate route lists for Next.js.
-   `extractRoutes` utility for React Router configuration.
