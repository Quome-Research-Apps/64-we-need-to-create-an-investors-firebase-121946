"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean | undefined;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem("isAuthenticated");
      setIsAuthenticated(storedAuth === "true");
    } catch (error) {
      setIsAuthenticated(false);
    }
  }, []);

  const login = () => {
    try {
      localStorage.setItem("isAuthenticated", "true");
    } catch (error) {
      // no-op
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    try {
      localStorage.removeItem("isAuthenticated");
    } catch (error) {
      // no-op
    }
    setIsAuthenticated(false);
  };
  
  const value = { isAuthenticated, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
