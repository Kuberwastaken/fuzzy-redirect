'use client';

import { useEffect, useMemo } from 'react';
// @ts-ignore - Ignore missing dependency for older Next.js versions
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { findClosestRoute, FuzzyMatchOptions } from '../core/fuzzy';

export interface UseFuzzyRedirectProps {
    routes: string[];
    options?: FuzzyMatchOptions;
    enabled?: boolean;
}

/**
 * Hook for Next.js App Router (Next.js 13+).
 */
export function useAppFuzzyRedirect({ routes, options, enabled = true }: UseFuzzyRedirectProps): string | null {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const closest = useMemo(() => {
        if (!enabled || !pathname) return null;
        try {
            return findClosestRoute(pathname, routes, options);
        } catch (error) {
            console.error('[fuzzy-redirect] Error finding closest route:', error);
            return null;
        }
    }, [pathname, routes, options, enabled]);

    useEffect(() => {
        if (!enabled || !pathname || !closest) return;

        if (closest !== pathname) {
            // Preserve query params
            const search = searchParams?.toString();
            const target = search ? `${closest}?${search}` : closest;

            options?.onRedirect?.(pathname, closest);
            router.replace(target);
        }
    }, [pathname, closest, router, searchParams, options, enabled]);

    if (!pathname) return null;
    return closest;
}
