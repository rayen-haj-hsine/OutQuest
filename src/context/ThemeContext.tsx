import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, fonts, spacing, borderRadius, shadows, ThemeType } from '../utils/theme';

interface ThemeContextType {
  isDark: boolean;
  theme: ThemeType;
  fontScale: number;
  toggleTheme: () => void;
  setFontScale: (scale: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@outquest_theme_is_dark';
const FONT_SCALE_KEY = '@outquest_font_scale';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(true);
  const [fontScale, setFontScaleState] = useState(1);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme !== null) setIsDark(storedTheme === 'true');

        const storedScale = await AsyncStorage.getItem(FONT_SCALE_KEY);
        if (storedScale !== null) setFontScaleState(parseFloat(storedScale));
      } catch (e) {
        console.error('Failed to load theme settings', e);
      }
    };
    loadSettings();
  }, []);

  const toggleTheme = async () => {
    try {
      const newValue = !isDark;
      setIsDark(newValue);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, String(newValue));
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  };

  const setFontScale = async (scale: number) => {
    try {
      setFontScaleState(scale);
      await AsyncStorage.setItem(FONT_SCALE_KEY, String(scale));
    } catch (e) {
      console.error('Failed to save font scale', e);
    }
  };

  const theme: ThemeType = {
    colors: isDark ? darkColors : lightColors,
    fonts,
    spacing,
    borderRadius,
    shadows,
  };

  return (
    <ThemeContext.Provider value={{ isDark, theme, fontScale, toggleTheme, setFontScale }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
