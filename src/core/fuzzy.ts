// Simple LRU Cache implementation to avoid dependencies
class SimpleLRU<K, V> {
    private max: number;
    private cache: Map<K, V>;

    constructor(max: number) {
        this.max = max;
        this.cache = new Map();
    }

    get(key: K): V | undefined {
        const item = this.cache.get(key);
        if (item !== undefined) {
            // Refresh key
            this.cache.delete(key);
            this.cache.set(key, item);
        }
        return item;
    }

    set(key: K, value: V): void {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.max) {
            // Evict oldest (first)
            const firstKey = this.cache.keys().next().value;
            if (firstKey !== undefined) {
                this.cache.delete(firstKey);
            }
        }
        this.cache.set(key, value);
    }

    has(key: K): boolean {
        return this.cache.has(key);
    }
}

/**
 * Calculates the Levenshtein distance between two strings.
 * Optimized with a two-row array approach to reduce memory allocation.
 * @param a - First string
 * @param b - Second string
 * @returns The edit distance
 */
export function levenshteinDistance(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    // Use two rows to track current and previous values
    let prev = new Uint16Array(b.length + 1);
    let curr = new Uint16Array(b.length + 1);

    // Initialize first row
    for (let j = 0; j <= b.length; j++) {
        prev[j] = j;
    }

    for (let i = 1; i <= a.length; i++) {
        curr[0] = i;

        for (let j = 1; j <= b.length; j++) {
            if (a.charAt(i - 1) === b.charAt(j - 1)) {
                curr[j] = prev[j - 1];
            } else {
                curr[j] = Math.min(
                    prev[j - 1] + 1,  // Substitution
                    prev[j] + 1,       // Deletion
                    curr[j - 1] + 1    // Insertion
                );
            }
        }

        // Swap rows
        [prev, curr] = [curr, prev];
    }

    return prev[b.length];
}

export interface FuzzyMatchOptions {
    threshold?: number; // Max edit distance allowed. Default: 3
    relativeThreshold?: number; // Max distance relative to length (0-1). Default: 0.4
    exclude?: string[]; // Routes to exclude from matching
    onRedirect?: (from: string, to: string) => void; // Callback when a redirect is found
}

// LRU Cache for route matching results
const routeCache = new SimpleLRU<string, string | null>(500);

/**
 * Checks if a route is safe to redirect to.
 * Prevents open redirects to external sites or protocol-relative URLs.
 */
function isSafeRoute(route: string): boolean {
    return route.startsWith('/') &&
        !route.startsWith('//') &&  // Protocol-relative URLs
        !/^https?:/i.test(route);    // Absolute URLs
}

/**
 * Finds the closest matching route from a list of valid routes.
 * @param currentPath - The path the user entered (e.g., "/abuot")
 * @param validRoutes - List of valid route strings (e.g., ["/about", "/contact"])
 * @param options - Configuration options
 * @returns The closest route or null if no match found within threshold
 */
export function findClosestRoute(
    currentPath: string,
    validRoutes: string[],
    options: FuzzyMatchOptions = {}
): string | null {
    const {
        threshold = 3,
        relativeThreshold = 0.4,
        exclude = []
    } = options;

    // Create a cache key based on inputs
    const cacheKey = `${currentPath}:${threshold}:${relativeThreshold}:${validRoutes.length}:${exclude.join(',')}`;

    if (routeCache.has(cacheKey)) {
        return routeCache.get(cacheKey)!;
    }

    // Normalize path: remove trailing slash, ensure leading slash, decode URI
    const normalize = (p: string) => {
        try {
            p = decodeURI(p);
        } catch (e) {
            // Ignore malformed URI
        }
        let s = p.trim();
        if (!s.startsWith('/')) s = '/' + s;
        if (s.length > 1 && s.endsWith('/')) s = s.slice(0, -1);
        return s.toLowerCase();
    };

    const normalizedCurrent = normalize(currentPath);

    let bestMatch: string | null = null;
    let minDistance = Infinity;

    for (const route of validRoutes) {
        // Security check
        if (!isSafeRoute(route)) {
            console.warn(`[fuzzy-redirect] Skipping unsafe route: ${route}`);
            continue;
        }

        // Exclusion check
        if (exclude.some(e => route.includes(e))) {
            continue;
        }

        const normalizedRoute = normalize(route);

        // Exact match check
        if (normalizedCurrent === normalizedRoute) {
            routeCache.set(cacheKey, route);
            return route;
        }

        const distance = levenshteinDistance(normalizedCurrent, normalizedRoute);

        // Check thresholds
        const maxDist = Math.min(threshold, Math.floor(normalizedRoute.length * relativeThreshold));

        if (distance <= maxDist && distance < minDistance) {
            minDistance = distance;
            bestMatch = route;
        }
    }

    routeCache.set(cacheKey, bestMatch);
    return bestMatch;
}
