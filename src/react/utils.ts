import { RouteObject } from 'react-router-dom';

/**
 * Recursively extracts valid paths from a React Router configuration.
 * @param routes - The route configuration array (from createBrowserRouter or useRoutes)
 * @param parentPath - Internal use for recursion
 * @returns An array of absolute path strings
 */
export function extractRoutes(routes: RouteObject[], parentPath = ''): string[] {
    let paths: string[] = [];

    for (const route of routes) {
        let currentPath = parentPath;

        if (route.path) {
            // Handle relative paths
            const cleanPath = route.path.replace(/^\//, ''); // Remove leading slash

            if (parentPath === '/') {
                currentPath = `/${cleanPath}`;
            } else {
                currentPath = `${parentPath}/${cleanPath}`;
            }

            // Clean up double slashes if any
            currentPath = currentPath.replace(/\/+/g, '/');

            // Don't add paths with parameters (e.g., /users/:id) as they can't be fuzzy matched easily
            // unless we implement advanced pattern matching. For now, we skip them or keep them?
            // Keeping them might cause weird matches like "/users/123" matching "/users/:id" literally.
            // Better to exclude dynamic segments for now or just include them and let the user decide.
            // We will include them but users should be aware.
            paths.push(currentPath);
        }

        if (route.children) {
            paths = paths.concat(extractRoutes(route.children, currentPath));
        }
    }

    // Filter out duplicates and ensure unique
    return Array.from(new Set(paths));
}
