/**
 * Calculates the Levenshtein distance between two strings.
 * @param a - First string
 * @param b - Second string
 * @returns The edit distance
 */
export function levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1 // deletion
                    )
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

export interface FuzzyMatchOptions {
    threshold?: number; // Max edit distance allowed. Default: 3
    relativeThreshold?: number; // Max distance relative to length (0-1). Default: 0.4
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
    const { threshold = 3, relativeThreshold = 0.4 } = options;

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
        const normalizedRoute = normalize(route);

        // Exact match check (should be handled by router, but good sanity check)
        if (normalizedCurrent === normalizedRoute) {
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

    return bestMatch;
}
