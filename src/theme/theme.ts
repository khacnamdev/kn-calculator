import { MD3LightTheme, MD3DarkTheme, adaptNavigationTheme } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import { lightColors, darkColors } from './colors';

// Adapt themes to React Navigation
const { LightTheme: navLightTheme, DarkTheme: navDarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavDarkTheme,
});

/**
 * Material 3 Light Theme for React Native Paper
 */
export const PaperLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...lightColors,
  },
  roundness: 3,
};

/**
 * Material 3 Dark Theme for React Native Paper
 */
export const PaperDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...darkColors,
  },
  roundness: 3,
};

/**
 * Navigation Light Theme
 */
export const NavigationLightTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    ...navLightTheme.colors,
    ...lightColors,
  },
};

/**
 * Navigation Dark Theme
 */
export const NavigationDarkTheme = {
  ...NavDarkTheme,
  colors: {
    ...NavDarkTheme.colors,
    ...navDarkTheme.colors,
    ...darkColors,
  },
};
