# fuzzy-redirect

Autocorrect for your Website URLs - Fuzzy URL matching and redirection for React and Next.js applications. Prevents 404 errors by automatically redirecting users to the closest matching valid route when they enter a URL with typos or minor structure errors.

## Features

- **Fuzzy Matching**: Uses Levenshtein distance to find the closest route.
- **React Support**: Hooks and components for React Router.
- **Next.js Support**: Hooks for both Pages Router and App Router.
- **Configurable**: Adjust sensitivity thresholds.
- **Lightweight**: Minimal dependencies.
- **TypeScript**: Fully typed.

## Installation

```bash
npm install fuzzy-redirect
# or
yarn add fuzzy-redirect
# or
pnpm add fuzzy-redirect
```

## Usage

### React (with React Router)

Use the `useFuzzyRedirect` hook in your 404 component or a global layout.

```tsx
import React from 'react';
import { useFuzzyRedirect } from 'fuzzy-redirect';

const validRoutes = ['/about', '/contact', '/products', '/blog'];

const NotFound = () => {
  // Automatically redirects if a close match is found
  const redirectedTo = useFuzzyRedirect({ routes: validRoutes });

  if (redirectedTo) {
    return <p>Redirecting to {redirectedTo}...</p>;
  }

  return <h1>404 - Page Not Found</h1>;
};

export default NotFound;
```

### Next.js (Pages Router)

```tsx
// pages/404.tsx
import { useFuzzyRedirect } from 'fuzzy-redirect/next';

const validRoutes = ['/about', '/contact', '/products'];

export default function Custom404() {
  useFuzzyRedirect({ routes: validRoutes });

  return <h1>404 - Page Not Found</h1>;
}
```

### Next.js (App Router)

```tsx
// app/not-found.tsx
'use client';

import { useAppFuzzyRedirect } from 'fuzzy-redirect/next-app';

const validRoutes = ['/about', '/contact', '/products'];

export default function NotFound() {
  useAppFuzzyRedirect({ routes: validRoutes });

  return <h1>404 - Page Not Found</h1>;
}
```

### Core API

You can also use the core logic directly without any framework dependencies.

```ts
import { findClosestRoute } from 'fuzzy-redirect/core';

const match = findClosestRoute('/abuot', ['/about', '/contact']);
console.log(match); // '/about'
```

## Configuration

You can pass an options object to customize the matching behavior.

```ts
useFuzzyRedirect({
  routes: validRoutes,
  options: {
    threshold: 3, // Max edit distance (default: 3)
    relativeThreshold: 0.4 // Max distance relative to string length (default: 0.4)
  }
});
```

## Auto-Generate Routes

Instead of manually maintaining the route list, you can auto-generate it.

### Next.js (CLI)

Run the generator script to scan your `pages/` or `app/` directory and create a `fuzzy-routes.ts` file.

```bash
npx fuzzy-redirect-gen
```

Then import it in your 404 page:

```tsx
import { fuzzyRoutes } from '../fuzzy-routes'; // Adjust path
import { useFuzzyRedirect } from 'fuzzy-redirect/next';

export default function Custom404() {
  useFuzzyRedirect({ routes: fuzzyRoutes });
  return <h1>404 - Page Not Found</h1>;
}
```

### React (React Router)

If you are using `createBrowserRouter` (Data APIs), you can extract routes from your configuration.

```tsx
import { createBrowserRouter } from 'react-router-dom';
import { extractRoutes, FuzzyRedirect } from 'fuzzy-redirect';

const routes = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  // ...
];

const router = createBrowserRouter(routes);
const validRoutes = extractRoutes(routes);

// In your NotFound component
<FuzzyRedirect routes={validRoutes} />
```

## License

MIT © [Kuber Mehta](https://github.com/Kuberwastaken/fuzzy-redirect/blob/main/LICENSE)

