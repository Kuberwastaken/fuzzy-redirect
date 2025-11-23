import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { findClosestRoute, FuzzyMatchOptions } from '../core/fuzzy';

export * from './utils';
export interface UseFuzzyRedirectProps {
    routes: string[];
    options?: FuzzyMatchOptions;
}

/**
 * Hook to automatically redirect to the closest matching route on 404.
 * Note: This hook should be used in a component that renders when no other route matches (e.g., a 404 page),
 * or it can be used globally if you manually check for 404s.
 * 
 * Usage:
 * const NotFound = () => {
 *   const redirected = useFuzzyRedirect({ routes: allRoutes });
 *   if (redirected) return <p>Redirecting...</p>;
 *   return <h1>404 Not Found</h1>;
 * };
 */
export function useFuzzyRedirect({ routes, options }: UseFuzzyRedirectProps): string | null {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const currentPath = location.pathname;
        const closest = findClosestRoute(currentPath, routes, options);

        if (closest && closest !== currentPath) {
            // Prevent infinite loops if closest is same as current (handled in findClosest but double check)
            navigate(closest, { replace: true });
        }
    }, [location.pathname, navigate, routes, options]);

    const currentPath = location.pathname;
    return findClosestRoute(currentPath, routes, options);
}

/**
 * Component wrapper for the hook.
 */
export const FuzzyRedirect: React.FC<UseFuzzyRedirectProps> = (props) => {
    useFuzzyRedirect(props);
    return null;
};
