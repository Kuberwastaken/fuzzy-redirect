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
const mockUseSearchParams = jest.fn();
jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
    useSearchParams: () => mockUseSearchParams(),
    useRouter: () => ({
        replace: mockAppReplace,
    }),
}));

describe('useFuzzyRedirect (Next.js Pages)', () => {
    const routes = ['/about', '/contact'];

    beforeEach(() => {
        mockReplace.mockClear();
    });

    test('redirects on typo and preserves query', () => {
        // The mock returns /abuot?query=1, so it should redirect to /about?query=1
        renderHook(() => useFuzzyRedirect({ routes }));
        expect(mockReplace).toHaveBeenCalledWith('/about?query=1');
    });
});

describe('useAppFuzzyRedirect (Next.js App)', () => {
    const routes = ['/about', '/contact'];
    const usePathname = require('next/navigation').usePathname;

    beforeEach(() => {
        mockAppReplace.mockClear();
        mockUseSearchParams.mockReturnValue({ toString: () => 'ref=google' });
    });

    test('redirects on typo and preserves query', () => {
        usePathname.mockReturnValue('/abuot');
        renderHook(() => useAppFuzzyRedirect({ routes }));
        expect(mockAppReplace).toHaveBeenCalledWith('/about?ref=google');
    });

    test('does not redirect on exact match', () => {
        usePathname.mockReturnValue('/about');
        renderHook(() => useAppFuzzyRedirect({ routes }));
        expect(mockAppReplace).not.toHaveBeenCalled();
    });
});
