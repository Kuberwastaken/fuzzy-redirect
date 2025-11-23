import { renderHook } from '@testing-library/react';
import { useFuzzyRedirect } from '../src/next';
import { useAppFuzzyRedirect } from '../src/next/app';

// Mock next/router
const mockReplace = jest.fn();
jest.mock('next/router', () => ({
    useRouter: () => ({
        isReady: true,
        asPath: '/abuot?query=1',
        replace: mockReplace,
    }),
}));

// Mock next/navigation
const mockAppReplace = jest.fn();
jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
    useRouter: () => ({
        replace: mockAppReplace,
    }),
}));

describe('useFuzzyRedirect (Next.js Pages)', () => {
    const routes = ['/about', '/contact'];

    beforeEach(() => {
        mockReplace.mockClear();
    });

    test('redirects on typo', () => {
        // The mock returns /abuot, so it should redirect to /about
        renderHook(() => useFuzzyRedirect({ routes }));
        expect(mockReplace).toHaveBeenCalledWith('/about');
    });
});

describe('useAppFuzzyRedirect (Next.js App)', () => {
    const routes = ['/about', '/contact'];
    const usePathname = require('next/navigation').usePathname;

    beforeEach(() => {
        mockAppReplace.mockClear();
    });

    test('redirects on typo', () => {
        usePathname.mockReturnValue('/abuot');
        renderHook(() => useAppFuzzyRedirect({ routes }));
        expect(mockAppReplace).toHaveBeenCalledWith('/about');
    });

    test('does not redirect on exact match', () => {
        usePathname.mockReturnValue('/about');
        renderHook(() => useAppFuzzyRedirect({ routes }));
        expect(mockAppReplace).not.toHaveBeenCalled();
    });
});
