import { useEffect } from 'react';
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

    useEffect(() => {
        // Ensure router is ready
        if (!router.isReady) return;

        const currentPath = router.asPath.split('?')[0]; // Ignore query params
        const closest = findClosestRoute(currentPath, routes, options);

        if (closest && closest !== currentPath) {
            router.replace(closest);
        }
    }, [router.isReady, router.asPath, routes, options]);

    if (!router.isReady) return null;
    return findClosestRoute(router.asPath.split('?')[0], routes, options);
}
