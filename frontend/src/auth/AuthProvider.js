import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = (username, password) => {
    setLoading(true);
    // Mock authentication
    if (username === "admin" && password === "password") {
      setIsAuthenticated(true);
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}