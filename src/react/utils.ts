import { RouteObject } from 'react-router-dom';

/**
 * Recursively extracts valid paths from a React Router configuration.
 * @param routes - The route configuration array (from createBrowserRouter or useRoutes)
 * @param parentPath - Internal use for recursion
 * @returns An array of absolute path strings
 */
export function extractRoutes(routes: RouteObject[], parentPath = ''): string[] {
    if (!Array.isArray(routes)) {
        console.warn('[fuzzy-redirect] extractRoutes expected an array of routes');
        return [];
    }

    let paths: string[] = [];

    for (const route of routes) {
        if (!route || typeof route !== 'object') continue;

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

            paths.push(currentPath);
        }

        if (route.children && Array.isArray(route.children)) {
            paths = paths.concat(extractRoutes(route.children, currentPath));
        }
    }

    // Filter out duplicates and ensure unique
    return Array.from(new Set(paths));
}
