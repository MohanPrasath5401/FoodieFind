// frontend/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Check localStorage when the app first loads.
  // We use the function form of useState to ensure this check runs ONLY ONCE.
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('userInfo');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user info from localStorage", error);
      return null;
    }
  });

  // 2. Modify the login function to save to localStorage.
  const login = (userData) => {
    try {
      // Save the entire user object (including token and role) as a string.
      localStorage.setItem('userInfo', JSON.stringify(userData));
      setUser(userData); // Update the React state.
    } catch (error) {
      console.error("Failed to save user info to localStorage", error);
    }
  };

  // 3. Modify the logout function to clear from localStorage.
  const logout = () => {
    try {
      // Remove the user from localStorage. This is a crucial step.
      localStorage.removeItem('userInfo');
      setUser(null); // Update the React state to null.
    } catch (error) {
      console.error("Failed to remove user info from localStorage", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);