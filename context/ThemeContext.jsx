import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const lightColors = {
  background: '#F2F2F7',
  surface: '#FFFFFF',
  surfaceSecondary: '#F2F2F7',
  surfaceElevated: '#FFFFFF',
  primary: '#007AFF',
  primaryMuted: '#EFF6FF',
  label: '#000000',
  labelSecondary: '#6B6B6B',
  labelTertiary: '#9CA3AF',
  separator: '#E5E7EB',
  separatorOpaque: '#C6C6C8',
  red: '#FF3B30',
  redMuted: '#FFF1F0',
  green: '#34C759',
  greenMuted: '#F0FDF4',
  orange: '#FF9500',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E5E7EB',
  inputBg: '#FFFFFF',
  inputBorder: '#D1D5DB',
  inputFocusBorder: '#007AFF',
  pillBg: '#EFF6FF',
  pillText: '#2563EB',
  iconBg: '#EFF6FF',
  iconColor: '#007AFF',
  statusBarStyle: 'dark',
  shadow: 'rgba(0,0,0,0.08)',
};

const darkColors = {
  background: '#000000',
  surface: '#1C1C1E',
  surfaceSecondary: '#2C2C2E',
  surfaceElevated: '#3A3A3C',
  primary: '#0A84FF',
  primaryMuted: '#1C3660',
  label: '#FFFFFF',
  labelSecondary: '#EBEBF5',
  labelTertiary: '#636366',
  separator: '#38383A',
  separatorOpaque: '#545456',
  red: '#FF453A',
  redMuted: '#3D1110',
  green: '#30D158',
  greenMuted: '#0D2B16',
  orange: '#FF9F0A',
  tabBar: '#1C1C1E',
  tabBarBorder: '#38383A',
  inputBg: '#2C2C2E',
  inputBorder: '#48484A',
  inputFocusBorder: '#0A84FF',
  pillBg: '#1C3660',
  pillText: '#4DA3FF',
  iconBg: '#1C3660',
  iconColor: '#0A84FF',
  statusBarStyle: 'light',
  shadow: 'rgba(0,0,0,0.0)',
};

const ThemeContext = createContext({
  isDark: false,
  colors: lightColors,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('theme').then((saved) => {
      if (saved === 'dark') setIsDark(true);
    });
  }, []);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    await AsyncStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ isDark, colors: isDark ? darkColors : lightColors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
