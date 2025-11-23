import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { findClosestRoute, FuzzyMatchOptions } from '../core/fuzzy';

export interface UseFuzzyRedirectProps {
    routes: string[];
    options?: FuzzyMatchOptions;
}

/**
 * Hook for Next.js Pages Router (Next.js 12+).
 */
export function useFuzzyRedirect({ routes, options }: UseFuzzyRedirectProps): string | null {
    const router = useRouter();

    // Calculate closest match
    // We use asPath because it contains the full path including query
    // But for matching we only want the pathname
    const currentPath = router.isReady ? router.asPath.split('?')[0] : '';

    const closest = useMemo(() => {
        if (!currentPath) return null;
        return findClosestRoute(currentPath, routes, options);
    }, [currentPath, routes, options]);

    useEffect(() => {
        if (!router.isReady || !closest) return;

        if (closest !== currentPath) {
            // Preserve query params
            const queryIndex = router.asPath.indexOf('?');
            const query = queryIndex !== -1 ? router.asPath.substring(queryIndex) : '';
            const target = closest + query;

            router.replace(target);
        }
    }, [router.isReady, closest, currentPath, router.asPath, router]);

    if (!router.isReady) return null;
    return closest;
}
