import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (username, password) => {
    // Mock authentication
    if (username === "admin" && password === "password") {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsAuthenticated(false);

  return (
    <AuthCo
}

export function useAuth() {
  return useContext(AuthContext);
}