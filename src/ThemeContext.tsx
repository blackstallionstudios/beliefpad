import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { logger } from './lib/logger';

export type Theme = 'light' | 'dark';
export type FontFamily = 'mono' | 'sans' | 'serif';

interface ThemeContextType {
  theme: Theme;
  fontFamily: FontFamily;
  setTheme: (theme: Theme) => void;
  setFontFamily: (font: FontFamily) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  logger.info("TC", "ThemeProvider initializing");
  
  const [theme, setThemeState] = useState<Theme>('light');
  const [fontFamily, setFontFamilyState] = useState<FontFamily>('mono');

  useEffect(() => {
    logger.info("TC", "ThemeProvider loading saved preferences from localStorage");
    // Load saved preferences from localStorage
    const savedTheme = localStorage.getItem('beliefpad-theme') as Theme;
    const savedFont = localStorage.getItem('beliefpad-font') as FontFamily;
    
    logger.info("TC", `Saved theme: ${savedTheme}, saved font: ${savedFont}`);
    
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      logger.info("TC", `Setting theme to: ${savedTheme}`);
      setThemeState(savedTheme);
    }
    
    if (savedFont && ['mono', 'sans', 'serif'].includes(savedFont)) {
      logger.info("TC", `Setting font family to: ${savedFont}`);
      setFontFamilyState(savedFont);
    }
  }, []);

  useEffect(() => {
    logger.info("TC", `Applying theme to document: ${theme}`);
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('beliefpad-theme', theme);
  }, [theme]);

  useEffect(() => {
    logger.info("TC", `Applying font family to document: ${fontFamily}`);
    // Apply font to document
    document.documentElement.setAttribute('data-font', fontFamily);
    localStorage.setItem('beliefpad-font', fontFamily);
  }, [fontFamily]);

  const setTheme = (newTheme: Theme) => {
    logger.info("TC", `setTheme called with: ${newTheme}`);
    setThemeState(newTheme);
  };

  const setFontFamily = (newFont: FontFamily) => {
    logger.info("TC", `setFontFamily called with: ${newFont}`);
    setFontFamilyState(newFont);
  };

  return (
    <ThemeContext.Provider value={{ theme, fontFamily, setTheme, setFontFamily }}>
      {children}
    </ThemeContext.Provider>
  );
};