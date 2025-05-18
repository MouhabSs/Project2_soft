// ... existing code ...
jest.mock('./AuthProvider', () => ({
  useAuth: () => ({
    isAuthenticated: true, // or false, depending on your test scenario
  }),
}));
// ... existing code ...