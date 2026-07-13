# Implementation Plan - Elder Friendly Mode & History Font Settings

Optimizations for older users:
1. Add a dedicated **History Font Size** settings screen featuring a dynamic preview log and a custom iOS-style discrete slider.
2. Synchronize the active display area in **Elder Mode** so that both the current expression and the result have the same large, bold font size and color style (white, bold, `fontSize: 60`).

## User Review Required

> [!IMPORTANT]
> - A new stack screen `HistoryFontSize` will be registered in the navigation stack.
> - The settings row for "History Font Size" will navigate to this new screen instead of displaying the inline stepper.
> - The display screen's active expression and result will both be styled with `fontSize: 60` and bold white when Elder Mode is enabled, making it easier for seniors to read long equations and results together.

## Proposed Changes

### Component 1: Navigation Registry

#### [MODIFY] [navigation/types.ts](file:///home/namnk/ws/github/kn-calculator/src/navigation/types.ts)
- Add `HistoryFontSize: undefined` to `RootTabParamList`.

#### [MODIFY] [navigation/AppNavigator.tsx](file:///home/namnk/ws/github/kn-calculator/src/navigation/AppNavigator.tsx)
- Import `HistoryFontSizeScreen`.
- Register `<Stack.Screen name="HistoryFontSize" component={HistoryFontSizeScreen} />` with styled headers.

---

### Component 2: Screen Implementations

#### [NEW] [screens/HistoryFontSizeScreen.tsx](file:///home/namnk/ws/github/kn-calculator/src/screens/HistoryFontSizeScreen.tsx)
- Create a dedicated screen displaying mock calculation rows.
- Build a custom discrete slider at the bottom showing steps `[16, 20, 24, 28, 32, 36, 40]` with a white active thumb.
- Bind the slider value updates directly to Zustand settings `historyFontSize`.

#### [MODIFY] [screens/SettingsScreen.tsx](file:///home/namnk/ws/github/kn-calculator/src/screens/SettingsScreen.tsx)
- Accept the `navigation` prop.
- Replace the inline history font size stepper with a navigate button row tapping through to the new `HistoryFontSize` settings screen.
- Add style definitions for navigation row layouts (`navigateRow`, `navigateValue`, `navigateValText`).

#### [MODIFY] [screens/CalculatorScreen.tsx](file:///home/namnk/ws/github/kn-calculator/src/screens/CalculatorScreen.tsx)
- Update `displayExpr` and `displayResult` styles in `elderMode` so they both share the exact same style: `fontSize: 60`, `fontWeight: 'bold'`, `color: '#FFFFFF'`, and matching line heights.

---

## Verification Plan

### Automated Tests
- Run `pnpm test` to verify existing and settings tests continue to pass.
- Write/update tests to ensure settings values update correctly.

### Manual Verification
- Tap `Settings` -> `History Font Size` and check that the app navigates successfully.
- Interact with the custom slider, check that ticks select properly, and the mock rows update their font size reactively.
- Return to the calculator screen, enter calculations, and verify that both the active expression and result are large, bold, and white in Elder Mode.
