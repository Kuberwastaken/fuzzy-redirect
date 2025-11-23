import { useEffect } from 'react';
// @ts-ignore - Ignore missing dependency for older Next.js versions
import { usePathname, useRouter } from 'next/navigation';
import { findClosestRoute, FuzzyMatchOptions } from '../core/fuzzy';

export interface UseFuzzyRedirectProps {
    routes: string[];
    options?: FuzzyMatchOptions;
}

/**
 * Hook for Next.js App Router (Next.js 13+).
 */
export function useAppFuzzyRedirect({ routes, options }: UseFuzzyRedirectProps): string | null {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (!pathname) return;

        const closest = findClosestRoute(pathname, routes, options);

        if (closest && closest !== pathname) {
            router.replace(closest);
        }
    }, [pathname, router, routes, options]);

    if (!pathname) return null;
    return findClosestRoute(pathname, routes, options);
}
