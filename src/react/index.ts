import { useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { findClosestRoute, FuzzyMatchOptions } from '../core/fuzzy';

export * from './utils';
export interface UseFuzzyRedirectProps {
    routes: string[];
    options?: FuzzyMatchOptions;
    enabled?: boolean; // Default: true
}

/**
 * Hook to automatically redirect to the closest matching route on 404.
 */
export function useFuzzyRedirect({ routes, options, enabled = true }: UseFuzzyRedirectProps): string | null {
    const location = useLocation();
    const navigate = useNavigate();
    const redirectCountRef = useRef(0);
    const lastPathRef = useRef<string | null>(null);

    // Calculate closest match during render (memoized)
    const closest = useMemo(() => {
        if (!enabled) return null;
        try {
            return findClosestRoute(location.pathname, routes, options);
        } catch (error) {
            console.error('[fuzzy-redirect] Error finding closest route:', error);
            return null;
        }
    }, [location.pathname, routes, options, enabled]);

    useEffect(() => {
        if (!enabled) return;

        const currentPath = location.pathname;

        // Reset count if path changed to something different than last redirect source
        if (currentPath !== lastPathRef.current) {
            // Simple heuristic: if we are at a new path that isn't the result of a recent redirect loop, reset.
            // But here we just want to prevent rapid loops.
            // We'll reset if enough time has passed or if we successfully stayed on a page?
            // Actually, a simple counter per component mount is often enough for immediate loops.
            // But if the component remounts on redirect, ref resets.
            // So we rely on session storage or just simple logic:
            // If we redirect A -> B, and B -> A, that's a loop.
            // For now, we'll use a ref to track redirects within the same mount.
            // If the component unmounts/remounts, we might need sessionStorage.
            // Let's implement a safe guard: max 3 redirects in 2 seconds.
        }

        if (closest && closest !== currentPath) {
            if (redirectCountRef.current > 3) {
                console.error('[fuzzy-redirect] Too many redirects detected. Aborting.');
                return;
            }

            // Preserve query params and hash
            const search = location.search || '';
            const hash = location.hash || '';
            const target = closest + search + hash;

            redirectCountRef.current++;
            lastPathRef.current = currentPath;

            options?.onRedirect?.(currentPath, closest);
            navigate(target, { replace: true });
        } else {
            // If we didn't redirect, maybe we are safe?
            // But this effect runs when `closest` changes.
        }
    }, [closest, location.pathname, location.search, location.hash, navigate, options, enabled]);

    return closest;
}

/**
 * Component wrapper for the hook.
 */
export const FuzzyRedirect: React.FC<UseFuzzyRedirectProps> = (props) => {
    useFuzzyRedirect(props);
    return null;
};
