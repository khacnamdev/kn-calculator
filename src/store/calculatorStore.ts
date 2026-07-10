import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CalculatorState, HistoryItem, Settings } from '../types/calculator';
import { zustandStorage } from '../storage/mmkv';
import { Parser } from '../services/Parser';
import { engine } from '../services/CalculatorEngine';
import { formatResult } from '../utils/formatter';

interface CalculatorActions {
  pressKey: (value: string) => void;
  deleteLastToken: () => void;
  clearHistory: () => void;
  deleteHistoryItem: (id: string) => void;
  togglePinHistoryItem: (id: string) => void;
  restoreCalculation: (expression: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  
  // Memory functions
  memoryClear: () => void;
  memoryRecall: () => void;
  memoryStore: () => void;
  memoryAdd: () => void;
  memorySubtract: () => void;
}

type StoreType = CalculatorState & CalculatorActions & {
  isResultDisplay: boolean; // Tracks if the screen is displaying a finalized result
};

const DEFAULT_SETTINGS: Settings = {
  precision: 9,
  decimalSeparator: '.',
  groupingSeparator: ',',
  theme: 'system',
  vibration: true,
  sound: false,
  autoSaveHistory: true,
  historyLimit: 100,
};

const parser = new Parser();

export const useCalculatorStore = create<StoreType>()(
  persist(
    (set, get) => {
      // Helper to compute live result on-the-fly
      const updateLiveResult = (expression: string) => {
        if (!expression) {
          return '';
        }

        const { decimalSeparator, groupingSeparator, precision } = get().settings;
        const res = parser.parse(expression, decimalSeparator, groupingSeparator);

        if (res.success) {
          // If the parsed result is identical to a simple number, and it matches, don't show it if it's trivial
          // E.g., if user typed just '123', the live result is '123', which is redundant to display.
          // The UI will handle whether to display the live result if it differs from the active input.
          return formatResult(res.value, precision, decimalSeparator, groupingSeparator);
        }
        return '';
      };

      return {
        expression: '',
        result: '',
        history: [],
        settings: DEFAULT_SETTINGS,
        memory: 0,
        isResultDisplay: false,

        pressKey: (value: string) => {
          const state = get();
          let currentExpr = state.expression;
          let isResultDisp = state.isResultDisplay;

          // 1. Clear All
          if (value === 'AC') {
            set({
              expression: '',
              result: '',
              isResultDisplay: false,
            });
            return;
          }

          // 2. Backspace
          if (value === 'backspace') {
            if (isResultDisp) {
              set({ expression: '', result: '', isResultDisplay: false });
              return;
            }
            const nextExpr = engine.deleteLastChar(currentExpr);
            set({
              expression: nextExpr,
              result: updateLiveResult(nextExpr),
            });
            return;
          }

          // 3. Toggle Sign (±)
          if (value === '±') {
            if (isResultDisp) {
              // Negate the finalized result directly
              const resVal = parser.parse(currentExpr, state.settings.decimalSeparator, state.settings.groupingSeparator);
              if (resVal.success) {
                const negated = (-resVal.value).toString();
                const nextExpr = negated.replace(/\./g, state.settings.decimalSeparator);
                set({
                  expression: nextExpr,
                  result: '',
                  isResultDisplay: true,
                });
              }
              return;
            }

            const nextExpr = engine.toggleNegation(currentExpr);
            set({
              expression: nextExpr,
              result: updateLiveResult(nextExpr),
            });
            return;
          }

          // 4. Equal Sign (=) - Finalize Calculation
          if (value === '=') {
            if (!currentExpr || isResultDisp) return;

            const { decimalSeparator, groupingSeparator, precision, autoSaveHistory, historyLimit } = state.settings;
            const res = parser.parse(currentExpr, decimalSeparator, groupingSeparator);

            if (res.success) {
              const formattedResult = formatResult(res.value, precision, decimalSeparator, groupingSeparator);

              // Update history if auto-save is enabled
              let nextHistory = [...state.history];
              if (autoSaveHistory) {
                const historyItem: HistoryItem = {
                  id: Date.now().toString(),
                  expression: currentExpr,
                  result: formattedResult,
                  timestamp: Date.now(),
                  isPinned: false,
                };

                // Add to start of history
                nextHistory = [historyItem, ...nextHistory];
                if (nextHistory.length > historyLimit) {
                  nextHistory = nextHistory.slice(0, historyLimit);
                }
              }

              // Replace input expression with the finalized formatted result
              // But keep internal representation standard (so replacing comma separators if necessary)
              const standardizedExpr = res.value.toString().replace(/\./g, decimalSeparator);

              set({
                expression: standardizedExpr,
                result: '', // Clear live result as calculation is complete
                isResultDisplay: true,
                history: nextHistory,
              });
            } else {
              set({
                result: res.error || 'Error',
              });
            }
            return;
          }

          // 5. Normal input (operators, numbers, parentheses, decimal dot)
          // If we are showing a finalized result:
          // - If user types an operator, we continue the calculation on top of the result.
          // - If user types a number, parenthesis, or clear, we start a fresh equation.
          if (isResultDisp) {
            if ('+-*/%'.includes(value)) {
              isResultDisp = false;
              // Ensure we continue with the standard operators representation
              const baseExpr = currentExpr;
              currentExpr = engine.appendToken(baseExpr, value);
              set({
                expression: currentExpr,
                result: updateLiveResult(currentExpr),
                isResultDisplay: false,
              });
              return;
            } else {
              // Start fresh
              currentExpr = '';
              isResultDisp = false;
            }
          }

          const nextExpr = engine.appendToken(currentExpr, value);
          set({
            expression: nextExpr,
            result: updateLiveResult(nextExpr),
            isResultDisplay: isResultDisp,
          });
        },

        deleteLastToken: () => {
          const state = get();
          if (state.isResultDisplay) {
            set({ expression: '', result: '', isResultDisplay: false });
            return;
          }

          const nextExpr = engine.deleteLastToken(state.expression);
          set({
            expression: nextExpr,
            result: updateLiveResult(nextExpr),
          });
        },

        clearHistory: () => {
          set({ history: [] });
        },

        deleteHistoryItem: (id: string) => {
          set((state) => ({
            history: state.history.filter((item) => item.id !== id),
          }));
        },

        togglePinHistoryItem: (id: string) => {
          set((state) => ({
            history: state.history.map((item) =>
              item.id === id ? { ...item, isPinned: !item.isPinned } : item
            ),
          }));
        },

        restoreCalculation: (expression: string) => {
          set({
            expression,
            result: updateLiveResult(expression),
            isResultDisplay: false,
          });
        },

        updateSettings: (newSettings: Partial<Settings>) => {
          set((state) => {
            const nextSettings = { ...state.settings, ...newSettings };
            
            // Recalculate live result with new settings
            let nextResult = '';
            if (state.expression && !state.isResultDisplay) {
              const res = parser.parse(state.expression, nextSettings.decimalSeparator, nextSettings.groupingSeparator);
              if (res.success) {
                nextResult = formatResult(res.value, nextSettings.precision, nextSettings.decimalSeparator, nextSettings.groupingSeparator);
              }
            }

            return {
              settings: nextSettings,
              result: nextResult,
            };
          });
        },

        // Memory functions
        memoryClear: () => {
          set({ memory: 0 });
        },

        memoryRecall: () => {
          const state = get();
          const memoryVal = state.memory;
          
          // Format memory number into correct display separators before appending
          const formattedMem = memoryVal.toString().replace(/\./g, state.settings.decimalSeparator);
          
          let currentExpr = state.expression;
          if (state.isResultDisplay) {
            currentExpr = '';
          }

          const nextExpr = engine.appendToken(currentExpr, formattedMem);
          set({
            expression: nextExpr,
            result: updateLiveResult(nextExpr),
            isResultDisplay: false,
          });
        },

        memoryStore: () => {
          const state = get();
          const { decimalSeparator, groupingSeparator } = state.settings;
          
          // Evaluate current expression first
          const exprToParse = state.isResultDisplay ? state.expression : (state.result ? state.expression : state.expression);
          if (!exprToParse) return;

          const res = parser.parse(exprToParse, decimalSeparator, groupingSeparator);
          if (res.success) {
            set({ memory: res.value });
          }
        },

        memoryAdd: () => {
          const state = get();
          const { decimalSeparator, groupingSeparator } = state.settings;
          if (!state.expression) return;

          const res = parser.parse(state.expression, decimalSeparator, groupingSeparator);
          if (res.success) {
            set((prev) => ({ memory: prev.memory + res.value }));
          }
        },

        memorySubtract: () => {
          const state = get();
          const { decimalSeparator, groupingSeparator } = state.settings;
          if (!state.expression) return;

          const res = parser.parse(state.expression, decimalSeparator, groupingSeparator);
          if (res.success) {
            set((prev) => ({ memory: prev.memory - res.value }));
          }
        },
      };
    },
    {
      name: 'kn-calculator-persist',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        history: state.history,
        settings: state.settings,
        memory: state.memory,
      }), // Save history, settings, and memory, but not active session expression/result
    }
  )
);
