import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useFuzzyRedirect } from '../src/react';

// Component to test the hook
const TestComponent = ({ routes }: { routes: string[] }) => {
    const redirectedTo = useFuzzyRedirect({ routes });
    const location = useLocation();

    if (redirectedTo && redirectedTo !== location.pathname) {
        return <div>Redirecting to {redirectedTo}</div>;
    }

    return <div>Current: {location.pathname}{location.search}</div>;
};

describe('useFuzzyRedirect (React)', () => {
    const routes = ['/about', '/contact', '/products'];

    test('renders current path if match is exact', () => {
        render(
            <MemoryRouter initialEntries={['/about']}>
                <TestComponent routes={routes} />
            </MemoryRouter>
        );
        expect(screen.getByText('Current: /about')).toBeInTheDocument();
    });

    test('redirects on typo', () => {
        render(
            <MemoryRouter initialEntries={['/abuot']}>
                <Routes>
                    <Route path="*" element={<TestComponent routes={routes} />} />
                    <Route path="/about" element={<div>Arrived at About</div>} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByText('Arrived at About')).toBeInTheDocument();
    });

    test('preserves query params on redirect', () => {
        render(
            <MemoryRouter initialEntries={['/abuot?ref=google']}>
                <Routes>
                    <Route path="*" element={<TestComponent routes={routes} />} />
                    <Route path="/about" element={<LocationDisplay />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByText('Path: /about, Search: ?ref=google')).toBeInTheDocument();
    });
});

const LocationDisplay = () => {
    const location = useLocation();
    return <div>Path: {location.pathname}, Search: {location.search}</div>;
};
