import { levenshteinDistance, findClosestRoute } from '../src/core/fuzzy';

describe('Levenshtein Distance', () => {
    test('calculates distance correctly', () => {
        expect(levenshteinDistance('kitten', 'sitting')).toBe(3);
        expect(levenshteinDistance('book', 'back')).toBe(2);
        expect(levenshteinDistance('abc', 'abc')).toBe(0);
        expect(levenshteinDistance('', 'abc')).toBe(3);
    });
});

describe('findClosestRoute', () => {
    const routes = ['/about', '/contact', '/products/shoes', '/blog'];

    test('returns exact match', () => {
        expect(findClosestRoute('/about', routes)).toBe('/about');
    });

    test('returns closest match for typo', () => {
        expect(findClosestRoute('/abuot', routes)).toBe('/about');
        expect(findClosestRoute('/contatc', routes)).toBe('/contact');
    });

    test('returns closest match for structure error', () => {
        expect(findClosestRoute('/product/shoe', routes)).toBe('/products/shoes');
    });

    test('returns null if threshold exceeded', () => {
        expect(findClosestRoute('/xyz', routes)).toBe(null);
    });

    test('respects custom threshold', () => {
        expect(findClosestRoute('/ab', routes, { threshold: 1 })).toBe(null);
    });
});
