import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { RootTabParamList } from './types';
import { CalculatorScreen } from '../screens/CalculatorScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { HistoryFontSizeScreen } from '../screens/HistoryFontSizeScreen';
import { useTranslation } from '../i18n/useTranslation';

const Stack = createStackNavigator<RootTabParamList>();

export function AppNavigator() {
  const t = useTranslation();

  return (
    <Stack.Navigator
      initialRouteName="Calculator"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#000000' },
      }}
    >
      <Stack.Screen name="Calculator" component={CalculatorScreen} />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          title: t.settings,
          headerStyle: {
            backgroundColor: '#1C1C1E',
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#FFFFFF',
          },
          cardStyle: { backgroundColor: '#000000' },
        }}
      />
      <Stack.Screen
        name="HistoryFontSize"
        component={HistoryFontSizeScreen}
        options={{
          headerShown: true,
          title: t.historyFontSize,
          headerStyle: {
            backgroundColor: '#1C1C1E',
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#FFFFFF',
          },
          cardStyle: { backgroundColor: '#000000' },
        }}
      />
    </Stack.Navigator>
  );
}
