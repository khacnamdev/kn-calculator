import 'react-native-gesture-handler'; // Required to be imported first
import React from 'react';
import { useColorScheme, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';

import { AppNavigator } from './src/navigation/AppNavigator';
import { CombinedLightTheme, CombinedDarkTheme } from './src/theme/theme';
import { useCalculatorStore } from './src/store/calculatorStore';

export default function App() {
  const systemScheme = useColorScheme();
  const themeSetting = useCalculatorStore((state) => state.settings.theme);

  // Determine the active theme based on user settings and system preference
  const isDarkMode =
    themeSetting === 'dark' || (themeSetting === 'system' && systemScheme === 'dark');

  const theme = isDarkMode ? CombinedDarkTheme : CombinedLightTheme;

  return (
    <GestureHandlerRootView style={styles.container}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
