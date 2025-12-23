import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// --- Types ---
export type ThemeMode = 'light' | 'dark' | 'system';
export type PresetName = 'Default' | 'Ocean' | 'Forest' | 'Berry' | 'Custom';

export interface ColorPalette {
  primary: string; // HSL value string: "210 100% 50%"
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  card: string;
  border: string;
}

export interface DesignTokens {
  radius: number; // rem multiplier or px
  scaling: number; // %
  borderWidth: number; // px
  fontFamily: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  mode: ThemeMode;
  colors: ColorPalette;
  tokens: DesignTokens;
}

interface ThemeContextType {
  activeTheme: ThemeConfig;
  savedThemes: ThemeConfig[];
  setThemeMode: (mode: ThemeMode) => void;
  updateColor: (key: keyof ColorPalette, value: string) => void;
  updateToken: (key: keyof DesignTokens, value: number | string) => void;
  loadPreset: (presetId: string) => void;
  saveCurrentAsPreset: (name: string) => void;
  resetToDefault: () => void;
}

// --- Constants ---

const defaultColors: ColorPalette = {
  primary: '221 83% 53%',
  secondary: '210 40% 96%',
  accent: '262 83% 58%',
  background: '0 0% 100%',
  foreground: '222 47% 11%',
  card: '0 0% 100%',
  border: '214 32% 91%',
};

const defaultTokens: DesignTokens = {
  radius: 0.5,
  scaling: 100,
  borderWidth: 1,
  fontFamily: 'Inter, sans-serif'
};

const defaultTheme: ThemeConfig = {
  id: 'default',
  name: 'Default',
  mode: 'system',
  colors: defaultColors,
  tokens: defaultTokens
};

// --- Helper Functions ---

const injectCSSVariables = (theme: ThemeConfig) => {
  const root = document.documentElement;
  const { colors, tokens, mode } = theme;

  // Handle Dark/Light Mode Class
  root.classList.remove('light', 'dark');
  if (mode === 'system') {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.add(systemDark ? 'dark' : 'light');
  } else {
    root.classList.add(mode);
  }

  // Inject Colors
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });

  // Inject Tokens
  root.style.setProperty('--radius', `${tokens.radius}rem`);
  root.style.setProperty('--border-width', `${tokens.borderWidth}px`);
  root.style.setProperty('--theme-scaling', `${tokens.scaling}%`);
  root.style.setProperty('--font-primary', tokens.fontFamily);
};

// --- Context Implementation ---

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [activeTheme, setActiveTheme] = useState<ThemeConfig>(() => {
    const stored = localStorage.getItem('theme-active');
    return stored ? JSON.parse(stored) : defaultTheme;
  });

  const [savedThemes, setSavedThemes] = useState<ThemeConfig[]>(() => {
    const stored = localStorage.getItem('theme-presets');
    return stored ? JSON.parse(stored) : [defaultTheme];
  });

  // Apply CSS variables whenever activeTheme changes
  useEffect(() => {
    injectCSSVariables(activeTheme);
    localStorage.setItem('theme-active', JSON.stringify(activeTheme));
  }, [activeTheme]);

  // Persist presets
  useEffect(() => {
    localStorage.setItem('theme-presets', JSON.stringify(savedThemes));
  }, [savedThemes]);

  const setThemeMode = (mode: ThemeMode) => {
    setActiveTheme(prev => ({ ...prev, mode }));
  };

  const updateColor = useCallback((key: keyof ColorPalette, value: string) => {
    setActiveTheme(prev => ({
      ...prev,
      colors: { ...prev.colors, [key]: value }
    }));
  }, []);

  const updateToken = useCallback((key: keyof DesignTokens, value: number | string) => {
    setActiveTheme(prev => ({
      ...prev,
      tokens: { ...prev.tokens, [key]: value }
    }));
  }, []);

  const loadPreset = (presetId: string) => {
    const preset = savedThemes.find(t => t.id === presetId);
    if (preset) setActiveTheme(preset);
  };

  const saveCurrentAsPreset = (name: string) => {
    const newPreset = { ...activeTheme, id: Date.now().toString(), name };
    setSavedThemes(prev => [...prev, newPreset]);
  };

  const resetToDefault = () => {
    setActiveTheme(defaultTheme);
  };

  return (
    <ThemeContext.Provider value={{
      activeTheme,
      savedThemes,
      setThemeMode,
      updateColor,
      updateToken,
      loadPreset,
      saveCurrentAsPreset,
      resetToDefault
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
