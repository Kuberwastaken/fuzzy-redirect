# Changelog

All notable changes to this project will be documented in this file.

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
