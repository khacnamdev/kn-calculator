import { MD3LightTheme, MD3DarkTheme, adaptNavigationTheme } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { lightColors, darkColors } from './colors';

// Adapt themes to React Navigation
const { LightTheme: navLightTheme, DarkTheme: navDarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

/**
 * Combined Material 3 & Navigation Light Theme
 */
export const CombinedLightTheme = {
  ...MD3LightTheme,
  ...navLightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...navLightTheme.colors,
    ...lightColors,
  },
  roundness: 3, // MD3 rounded standard for buttons/cards
};

/**
 * Combined Material 3 & Navigation Dark Theme
 */
export const CombinedDarkTheme = {
  ...MD3DarkTheme,
  ...navDarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...navDarkTheme.colors,
    ...darkColors,
  },
  roundness: 3,
};
