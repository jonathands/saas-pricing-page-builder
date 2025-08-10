import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ThemeSettings {
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  headerFont: string;
  buttonFont: string;
  textFont: string;
}

export interface ThemeContextType {
  theme: ThemeSettings;
  updateTheme: (updates: Partial<ThemeSettings>) => void;
  resetTheme: () => void;
}

export const GOOGLE_FONTS = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Source Sans Pro',
  'Oswald',
  'Raleway',
  'PT Sans',
  'Merriweather',
  'Nunito',
  'Playfair Display',
  'Ubuntu',
  'Mukti',
  'Fira Sans',
  'Crimson Text',
  'Work Sans',
  'Libre Baskerville',
  'Rubik'
];

const DEFAULT_THEME: ThemeSettings = {
  backgroundColor: 'from-slate-50 to-slate-100',
  primaryColor: 'hsl(262, 80%, 50%)',
  secondaryColor: 'hsl(220, 14.3%, 95.9%)',
  headerFont: 'Inter',
  buttonFont: 'Inter',
  textFont: 'Inter'
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_THEME);

  const updateTheme = (updates: Partial<ThemeSettings>) => {
    setTheme(prev => ({ ...prev, ...updates }));
  };

  const resetTheme = () => {
    setTheme(DEFAULT_THEME);
  };

  // Load Google Fonts dynamically
  useEffect(() => {
    const fonts = [theme.headerFont, theme.buttonFont, theme.textFont];
    const uniqueFonts = [...new Set(fonts)];
    
    // Remove existing font links
    const existingLinks = document.querySelectorAll('link[data-font-link]');
    existingLinks.forEach(link => link.remove());
    
    // Add new font links
    uniqueFonts.forEach(font => {
      if (font !== 'Inter') { // Inter is already included
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@300;400;500;600;700&display=swap`;
        link.rel = 'stylesheet';
        link.setAttribute('data-font-link', 'true');
        document.head.appendChild(link);
      }
    });
  }, [theme.headerFont, theme.buttonFont, theme.textFont]);

  // Apply CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    
    // Extract HSL values from the primaryColor
    const primaryHsl = theme.primaryColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (primaryHsl) {
      const [, h, s, l] = primaryHsl;
      root.style.setProperty('--primary', `${h} ${s}% ${l}%`);
    }
    
    const secondaryHsl = theme.secondaryColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (secondaryHsl) {
      const [, h, s, l] = secondaryHsl;
      root.style.setProperty('--secondary', `${h} ${s}% ${l}%`);
    }
    
    root.style.setProperty('--font-header', theme.headerFont);
    root.style.setProperty('--font-button', theme.buttonFont);
    root.style.setProperty('--font-text', theme.textFont);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
