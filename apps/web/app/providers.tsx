"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  isDarkMode: true,
  toggleTheme: () => {},
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      root.style.backgroundColor = "#0b0b0f";
    } else {
      root.classList.remove("light");
      root.style.backgroundColor = "#ffffff";
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
