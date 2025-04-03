
import { createContext, useContext, useEffect, useState } from "react";

type BackgroundTheme = 
  | "default" 
  | "fazy-blue-purple" 
  | "black-white-mixed" 
  | "smooth-yellow" 
  | "red-carmal" 
  | "chocolate-fazy";

interface BackgroundThemeContextType {
  theme: BackgroundTheme;
  setTheme: (theme: BackgroundTheme) => void;
}

export const BackgroundThemeContext = createContext<BackgroundThemeContextType>({
  theme: "default",
  setTheme: () => {},
});

export function BackgroundThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<BackgroundTheme>(() => {
    const saved = localStorage.getItem("background-theme");
    return (saved as BackgroundTheme) || "default";
  });

  useEffect(() => {
    localStorage.setItem("background-theme", theme);
    document.body.className = `bg-${theme}`;
  }, [theme]);

  return (
    <BackgroundThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </BackgroundThemeContext.Provider>
  );
}

export function useBackgroundTheme() {
  const context = useContext(BackgroundThemeContext);
  if (!context) {
    throw new Error("useBackgroundTheme must be used within a BackgroundThemeProvider");
  }
  return context;
}
