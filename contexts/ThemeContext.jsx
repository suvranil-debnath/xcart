'use client';

import { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext({});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Always use dark mode
  useEffect(() => {
    // Apply dark mode
    document.documentElement.classList.add('dark');
    
    // Try to save to localStorage for persistence
    try {
      localStorage.setItem('theme', 'dark');
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  }, []);

  const value = {
    theme: 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};