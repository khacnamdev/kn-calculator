import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { useCalculatorStore } from '../calculatorStore';

jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    __esModule: true,
    default: {
      setItem: jest.fn(() => Promise.resolve()),
      getItem: jest.fn(() => Promise.resolve(null)),
      removeItem: jest.fn(() => Promise.resolve()),
    },
  };
});

describe('Calculator Settings Store Tests', () => {
  beforeEach(() => {
    // Reset to default settings before each test
    useCalculatorStore.getState().updateSettings({
      elderMode: true,
      historyFontSize: 24,
      precision: 9,
      decimalSeparator: '.',
      groupingSeparator: ',',
      theme: 'system',
      vibration: true,
      sound: false,
      autoSaveHistory: true,
      historyLimit: 100,
      language: 'en',
    });
  });

  test('should initialize with default elderMode and historyFontSize settings', () => {
    const settings = useCalculatorStore.getState().settings;
    expect(settings.elderMode).toBe(true);
    expect(settings.historyFontSize).toBe(24);
  });

  test('should toggle elderMode settings', () => {
    useCalculatorStore.getState().updateSettings({ elderMode: false });
    const settings = useCalculatorStore.getState().settings;
    expect(settings.elderMode).toBe(false);
  });

  test('should update historyFontSize settings', () => {
    useCalculatorStore.getState().updateSettings({ historyFontSize: 28 });
    const settings = useCalculatorStore.getState().settings;
    expect(settings.historyFontSize).toBe(28);
  });
});
