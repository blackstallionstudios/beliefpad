import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

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
  const [theme, setThemeState] = useState<Theme>('light');
  const [fontFamily, setFontFamilyState] = useState<FontFamily>('mono');

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedTheme = localStorage.getItem('beliefpad-theme') as Theme;
    const savedFont = localStorage.getItem('beliefpad-font') as FontFamily;
    
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setThemeState(savedTheme);
    }
    
    if (savedFont && ['mono', 'sans', 'serif'].includes(savedFont)) {
      setFontFamilyState(savedFont);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('beliefpad-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Apply font to document
    document.documentElement.setAttribute('data-font', fontFamily);
    localStorage.setItem('beliefpad-font', fontFamily);
  }, [fontFamily]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setFontFamily = (newFont: FontFamily) => {
    setFontFamilyState(newFont);
  };

  return (
    <ThemeContext.Provider value={{ theme, fontFamily, setTheme, setFontFamily }}>
      {children}
    </ThemeContext.Provider>
  );
};