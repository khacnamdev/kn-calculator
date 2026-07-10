import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { RootTabParamList } from './types';
import { CalculatorScreen } from '../screens/CalculatorScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { PinnedScreen } from '../screens/PinnedScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function AppNavigator() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Calculator"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'] = 'help';

          switch (route.name) {
            case 'Calculator':
              iconName = focused ? 'calculator' : 'calculator-variant-outline';
              break;
            case 'History':
              iconName = 'history';
              break;
            case 'Favorites':
              iconName = focused ? 'star' : 'star-outline';
              break;
            case 'Settings':
              iconName = focused ? 'cog' : 'cog-outline';
              break;
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.surfaceVariant,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.surfaceVariant,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.onBackground,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Calculator"
        component={CalculatorScreen}
        options={{
          headerShown: false, // Full screen responsive display for calculator
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'Calculation History',
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={PinnedScreen}
        options={{
          title: 'Pinned Calculations',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}
