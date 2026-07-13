import React from 'react';
import { useColorScheme, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/navigation/AppNavigator';
import { PaperLightTheme, PaperDarkTheme, NavigationLightTheme, NavigationDarkTheme } from './src/theme/theme';
import { useCalculatorStore } from './src/store/calculatorStore';

export default function App() {
  const systemScheme = useColorScheme();
  const themeSetting = useCalculatorStore((state) => state.settings.theme);

  // Determine the active theme based on user settings and system preference
  const isDarkMode =
    themeSetting === 'dark' || (themeSetting === 'system' && systemScheme === 'dark');

  const paperTheme = isDarkMode ? PaperDarkTheme : PaperLightTheme;
  const navigationTheme = isDarkMode ? NavigationDarkTheme : NavigationLightTheme;

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <PaperProvider theme={paperTheme}>
          <NavigationContainer theme={navigationTheme}>
            <AppNavigator />
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
