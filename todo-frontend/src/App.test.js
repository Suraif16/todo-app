import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock the AuthContext
const mockUser = null;
const mockLoading = false;

jest.mock('./contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    loading: mockLoading
  }),
  AuthProvider: ({ children }) => children
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => children,
  Routes: ({ children }) => children,
  Route: ({ element }) => element,
  Navigate: ({ to }) => <div>Navigate to {to}</div>
}));

// Mock components
jest.mock('./components/Auth/Login', () => () => <div>Login Component</div>);
jest.mock('./components/Auth/Register', () => () => <div>Register Component</div>);
jest.mock('./components/Dashboard/Dashboard', () => () => <div>Dashboard Component</div>);
jest.mock('./components/Common/Navbar', () => () => <div>Navbar Component</div>);
jest.mock('./components/Common/PrivateRoute', () => ({ children }) => children);

/**
 * Tests for main App component
 * Ensures routing works correctly
 */
describe('App', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Navigate to /login')).toBeInTheDocument();
  });
});
