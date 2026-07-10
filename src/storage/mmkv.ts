import { createMMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

/**
 * MMKV instance for high-performance synchronous storage.
 */
export const storage = createMMKV({
  id: 'kn-calculator-storage',
});

/**
 * Custom storage adapter to bind Zustand persistence middleware with MMKV.
 */
export const zustandStorage: StateStorage = {
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    storage.remove(name);
  },
};
