# Walkthrough & Deliverables

We have successfully implemented the Android Material 3 Calculator application following Clean Architecture principles. Below is a summary of the components, core layers, logic, and testing outcomes.

---

## 1. Project Architecture

The codebase is organized as follows:

```
src/
├── types/
│   └── calculator.ts          # State definitions, button types
├── constants/
│   └── buttons.ts             # Keypad grid matrix, memory configurations
├── services/
│   ├── Parser.ts              # Recursive descent parser (no eval)
│   └── CalculatorEngine.ts    # Input mutations, parentheses, negation, deletes
├── storage/
│   └── mmkv.ts                # Synchronous MMKV configuration for Zustand
├── store/
│   └── calculatorStore.ts    # Persisted state container
├── utils/
│   └── formatter.ts           # Localized numbers & expression beautifiers
├── theme/
│   ├── colors.ts              # Obsidian Dark & Soft Blue light schemes
│   └── theme.ts               # Combined Material 3 & Navigation themes
├── navigation/
│   ├── types.ts               # Tab parameters
│   └── AppNavigator.tsx       # Bottom tabs routes with Vector Icons
├── hooks/
│   └── useExternalKeyboard.ts # Physical keyboard intercepts (Enter, Esc, ⌫)
└── components/
    ├── CalcButton.tsx         # Spring-animated tactile keys with vibration
    ├── Display.tsx            # Gesture-enabled autoscaling readout screen
    ├── HistoryItemRow.tsx     # Swipeable history item container
    └── HistoryPanel.tsx       # Sliding float drawer with Search & Shop FlashList
```

---

## 2. Core Features Implemented

1.  **Expression Mode**: The Display component always displays the full formula rather than collapsing to a single intermediate result.
2.  **Live Result**: Sub-calculations are evaluated in real time (e.g. typing `125 + 38 * 4 - 10` renders `267` as a live suggestion).
3.  **Clean & Safe Parsing**: A custom tokenizing and parser engine avoids `eval()`, preventing scripts injection. It is grammar-complete and includes:
    *   Negation, parentheses matching, decimals.
    *   Contextual percentages: `200 + 5%` translates to `210` (scales the right percentage by the left total).
    *   Division by zero error tracking.
4.  **Local History & Favorites**: Pinned calculations and history records are synchronized synchronously via MMKV. Swiping a row reveals a "Delete" option; tapping a row restores its expression.
5.  **Tactile UI & Gestures**: Buttons slide down slightly on touch using `react-native-reanimated` springs. Swiping left on the display deletes the last token. Swiping left on history entries handles quick deletion.
6.  **Full Settings Customize**: Settings enable custom dot/comma separators (e.g. `1.234.567,89`), vibration, system theme-follow, and precision limits.
7.  **External Keyboards**: Implemented via a hidden input that absorbs keystrokes, linking numeric pads, escape, delete, and backspaces smoothly.

---

## 3. Verification & Testing

### Automated Unit Tests
We added Jest and verified the parser services and number formatter utilities.
Command:
```bash
npm run test
```
Result:
```
PASS  src/services/__tests__/Parser.test.ts
PASS  src/utils/__tests__/formatter.test.ts
Test Suites: 2 passed, 2 total
Tests:       23 passed, 23 total
Snapshots:   0 total
Time:        9.301 s
```
These tests cover precision rounding, grouping separator configurations, brackets auto-close parsing, context percentage, and operator replacements.
