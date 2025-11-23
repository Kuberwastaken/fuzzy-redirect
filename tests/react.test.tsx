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

    return <div>Current: {location.pathname}</div>;
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

        // The hook triggers a navigation. 
        // In a real app, this updates the router state.
        // We check if the router updated to the new path.
        expect(screen.getByText('Arrived at About')).toBeInTheDocument();
    });

    test('does not redirect if no match found', () => {
        render(
            <MemoryRouter initialEntries={['/xyz']}>
                <TestComponent routes={routes} />
            </MemoryRouter>
        );
        expect(screen.getByText('Current: /xyz')).toBeInTheDocument();
    });
});
