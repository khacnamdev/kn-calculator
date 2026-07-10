import { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

/**
 * MMKV instance for high-performance synchronous storage.
 */
export const storage = new MMKV({
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
    storage.delete(name);
  },
};
