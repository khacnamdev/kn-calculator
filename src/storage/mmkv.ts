import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateStorage } from 'zustand/middleware';

/**
 * Custom storage adapter to bind Zustand persistence middleware with AsyncStorage.
 */
export const zustandStorage: StateStorage = {
  setItem: async (name: string, value: string) => {
    await AsyncStorage.setItem(name, value);
  },
  getItem: async (name: string) => {
    const value = await AsyncStorage.getItem(name);
    return value ?? null;
  },
  removeItem: async (name: string) => {
    await AsyncStorage.removeItem(name);
  },
};
