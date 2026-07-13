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
      resultFontSize: 48,
      expressionFontSize: 72,
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

  test('should initialize with default settings including display sizes', () => {
    const settings = useCalculatorStore.getState().settings;
    expect(settings.elderMode).toBe(true);
    expect(settings.historyFontSize).toBe(24);
    expect(settings.resultFontSize).toBe(48);
    expect(settings.expressionFontSize).toBe(72);
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

  test('should update resultFontSize and expressionFontSize settings', () => {
    useCalculatorStore.getState().updateSettings({ resultFontSize: 36, expressionFontSize: 60 });
    const settings = useCalculatorStore.getState().settings;
    expect(settings.resultFontSize).toBe(36);
    expect(settings.expressionFontSize).toBe(60);
  });
});
