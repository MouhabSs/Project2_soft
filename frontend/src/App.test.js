import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the useAuth hook
jest.mock('./auth/AuthProvider', () => ({
  useAuth: () => ({
    isAuthenticated: true, // or false, depending on your test scenario
  }),
}));

test('renders home page heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Welcome to the Nutrition Clinic App/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders learn react link', () => {
  render(<App />);
  const headingElement = screen.getByText(/Welcome to the Nutrition Clinic App/i);
  expect(headingElement).toBeInTheDocument();
});