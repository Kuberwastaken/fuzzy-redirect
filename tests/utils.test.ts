import { extractRoutes } from '../src/react/utils';
import { RouteObject } from 'react-router-dom';

describe('extractRoutes', () => {
    test('extracts simple flat routes', () => {
        const routes: RouteObject[] = [
            { path: '/' },
            { path: '/about' },
            { path: 'contact' }, // relative path
        ];

        const extracted = extractRoutes(routes);
        expect(extracted).toEqual(['/', '/about', '/contact']);
    });

    test('extracts nested routes', () => {
        const routes: RouteObject[] = [
            {
                path: '/',
                children: [
                    { path: 'dashboard' },
                    { path: 'settings' }
                ]
            },
            {
                path: '/products',
                children: [
                    { path: 'shoes' },
                    { path: ':id' } // Dynamic param
                ]
            }
        ];

        const extracted = extractRoutes(routes);
        // Note: Our implementation includes dynamic segments as-is
        expect(extracted).toContain('/');
        expect(extracted).toContain('/dashboard');
        expect(extracted).toContain('/settings');
        expect(extracted).toContain('/products');
        expect(extracted).toContain('/products/shoes');
        expect(extracted).toContain('/products/:id');
    });

    test('handles trailing slashes and normalization', () => {
        const routes: RouteObject[] = [
            { path: '/about/' },
            { path: '//contact' }
        ];

        const extracted = extractRoutes(routes);
        expect(extracted).toContain('/about/');
        expect(extracted).toContain('/contact');
    });
});
