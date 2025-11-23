import { useEffect, useMemo } from 'react';
// @ts-ignore - Ignore missing dependency for older Next.js versions
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
    const searchParams = useSearchParams();

    const closest = useMemo(() => {
        if (!pathname) return null;
        return findClosestRoute(pathname, routes, options);
    }, [pathname, routes, options]);

    useEffect(() => {
        if (!pathname || !closest) return;

        if (closest !== pathname) {
            // Preserve query params
            const search = searchParams?.toString();
            const target = search ? `${closest}?${search}` : closest;

            router.replace(target);
        }
    }, [pathname, closest, router, searchParams]);

    if (!pathname) return null;
    return closest;
}
