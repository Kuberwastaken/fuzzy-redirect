import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { findClosestRoute, FuzzyMatchOptions } from '../core/fuzzy';

export interface UseFuzzyRedirectProps {
    routes: string[];
    options?: FuzzyMatchOptions;
    enabled?: boolean;
}

/**
 * Hook for Next.js Pages Router (Next.js 12+).
 */
export function useFuzzyRedirect({ routes, options, enabled = true }: UseFuzzyRedirectProps): string | null {
    const router = useRouter();

    // Calculate closest match
    const currentPath = router.isReady ? router.asPath.split('?')[0] : '';

    const closest = useMemo(() => {
        if (!enabled || !currentPath) return null;
        try {
            return findClosestRoute(currentPath, routes, options);
        } catch (error) {
            console.error('[fuzzy-redirect] Error finding closest route:', error);
            return null;
        }
    }, [currentPath, routes, options, enabled]);

    useEffect(() => {
        if (!enabled || !router.isReady || !closest) return;

        if (closest !== currentPath) {
            // Preserve query params
            const queryIndex = router.asPath.indexOf('?');
            const query = queryIndex !== -1 ? router.asPath.substring(queryIndex) : '';
            const target = closest + query;

            options?.onRedirect?.(currentPath, closest);
            router.replace(target);
        }
    }, [router.isReady, closest, currentPath, router.asPath, router, options, enabled]);

    if (!router.isReady) return null;
    return closest;
}
