import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { RootTabParamList } from './types';
import { CalculatorScreen } from '../screens/CalculatorScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Stack = createStackNavigator<RootTabParamList>();

export function AppNavigator() {
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
          title: 'Settings',
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
