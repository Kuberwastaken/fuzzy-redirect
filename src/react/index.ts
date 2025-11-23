import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { findClosestRoute, FuzzyMatchOptions } from '../core/fuzzy';

export * from './utils';
export interface UseFuzzyRedirectProps {
    routes: string[];
    options?: FuzzyMatchOptions;
}

/**
 * Hook to automatically redirect to the closest matching route on 404.
 */
export function useFuzzyRedirect({ routes, options }: UseFuzzyRedirectProps): string | null {
    const location = useLocation();
    const navigate = useNavigate();

    // Calculate closest match during render (memoized)
    const closest = useMemo(() => {
        return findClosestRoute(location.pathname, routes, options);
    }, [location.pathname, routes, options]);

    useEffect(() => {
        const currentPath = location.pathname;

        if (closest && closest !== currentPath) {
            // Preserve query params and hash
            const search = location.search || '';
            const hash = location.hash || '';
            const target = closest + search + hash;

            navigate(target, { replace: true });
        }
    }, [closest, location.pathname, location.search, location.hash, navigate]);

    return closest;
}

/**
 * Component wrapper for the hook.
 */
export const FuzzyRedirect: React.FC<UseFuzzyRedirectProps> = (props) => {
    useFuzzyRedirect(props);
    return null;
};
