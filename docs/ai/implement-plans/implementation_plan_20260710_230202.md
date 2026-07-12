# Material 3 Android Calculator with History

Build a responsive, premium Android calculator using Expo React Native, TypeScript, React Navigation, React Native Paper (Material 3), Reanimated, Zustand, and MMKV for local storage. The application features a clean, modular structure following Clean Architecture principles, a custom mathematical parser, live result evaluation, calculation history/favorites, full settings customization, external keyboard hooks, and smooth gesture control.

---

## User Review Required

Please review the architectural choices and feature implementations outlined below:

1. **State Persistence & Storage**: Zustand paired with MMKV for high-performance synchronous local storage. Pinned calculations and history items will be saved offline.
2. **Custom Math Parser**: A recursive descent parser in TypeScript to avoid `eval()`. This supports parentheses, percentages (`A + B%` as `A + A * (B/100)`, and `A * B%` as `A * B/100`), decimals, and unary negative numbers.
3. **Gesture Controls**:
   - Swipe left on the display to delete the last token.
   - Long press the backspace/DEL key to clear the entire expression.
   - Swipe on history list items to delete them using `react-native-gesture-handler` swipeable containers.
4. **Theme System**: Material 3 theme integrating system theme detection (light, dark, system-follow) and customizable settings (precision digits, grouping/decimal separators, key feedback sound/vibration).

---

## Open Questions

> [!IMPORTANT]
> **Dynamic Separators**: When the decimal separator is set to `,` and the grouping separator is set to `.`, entering numbers like `12.345` on an external keyboard will be interpreted as `12,345` (twelve point three four five) to match the locale. We will parse calculations internally using standard standard JS float numbers (`.` as decimal), but normalize formatting for both user display and key inputs. Let us know if there are other specific input preferences.

---

## Proposed Changes

We will bootstrap the application using Expo with a TypeScript template and configure the following structure:

```
src/
├── components/      # UI components (Button, Keypad, HistoryList, PinnedList)
├── screens/         # Screens (CalculatorScreen, HistoryScreen, PinnedScreen, SettingsScreen)
├── navigation/      # React Navigation setup (Tabs & Stacks)
├── hooks/           # Custom React hooks (useExternalKeyboard, useHaptics)
├── services/        # Business logic (CalculatorEngine, Parser)
├── storage/         # MMKV storage setup
├── store/           # Zustand state store
├── utils/           # Formatters & helper functions
├── constants/       # Global constants (keys, buttons, themes)
├── types/           # Type definitions (history, settings, navigation)
└── theme/           # React Native Paper MD3 theme settings
```

---

### Phase 1: Bootstrapping & Setup

#### [NEW] [package.json](file:///home/namnk/ws/github/kn-calculator/package.json)
Initialize the project using `create-expo-app` with the blank-typescript template. We will install:
- `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/stack`
- `react-native-screens`, `react-native-safe-area-context`
- `react-native-mmkv`
- `zustand`
- `react-native-reanimated`, `react-native-gesture-handler`
- `react-native-paper`
- `react-native-svg`
- `react-native-vector-icons`
- `@shopify/flash-list` (for high-performance history rendering)

---

### Phase 2: Domain Logic (Engine & Parser)

#### [NEW] [types/calculator.ts](file:///home/namnk/ws/github/kn-calculator/src/types/calculator.ts)
Defines structure of calculations, history, favorites, settings, and button tokens.

#### [NEW] [services/Parser.ts](file:///home/namnk/ws/github/kn-calculator/src/services/Parser.ts)
A custom tokenizer and Recursive Descent Parser to evaluate mathematical expressions securely:
- Tokenizer: Separates number tokens, operators (`+`, `-`, `×`, `÷`), parentheses `()`, and `%`.
- Grammar support:
  ```
  expression -> term (( "+" | "-" ) term)*
  term       -> factor (( "×" | "÷" ) factor)*
  factor     -> unary
  unary      -> "-" unary | "+" unary | postfix
  postfix    -> primary "%"?
  primary    -> number | "(" expression ")"
  ```
- Evaluator includes context-aware percentages: `A + B%` scales `B` by `A` (`A + A * B / 100`).

#### [NEW] [services/CalculatorEngine.ts](file:///home/namnk/ws/github/kn-calculator/src/services/CalculatorEngine.ts)
Wrapper service that manages the active state: appending tokens, handling parentheses pairs, validation, backspace operations, and clearing.

#### [NEW] [utils/formatter.ts](file:///home/namnk/ws/github/kn-calculator/src/utils/formatter.ts)
Formats inputs and outputs dynamically based on settings:
- Precision digits limit.
- Customizable decimal separator (`.` or `,`) and grouping separator (`,` or `.` or spaces).

---

### Phase 3: Infrastructure (Storage & State)

#### [NEW] [storage/mmkv.ts](file:///home/namnk/ws/github/kn-calculator/src/storage/mmkv.ts)
Configures MMKV storage and sets up integration middleware for Zustand.

#### [NEW] [store/calculatorStore.ts](file:///home/namnk/ws/github/kn-calculator/src/store/calculatorStore.ts)
Zustand global store managing:
- Current expression state, active draft calculation, live result.
- Calculations history (maximum history limit, auto-save settings).
- Favorites list (pinning calculations).
- App Settings (vibration toggles, custom separators, precision limits, theme mode).
- Memory register (`MC`, `MR`, `MS`, `M+`, `M-`).

---

### Phase 4: UI & Styling (Theme & Design System)

#### [NEW] [theme/colors.ts](file:///home/namnk/ws/github/kn-calculator/src/theme/colors.ts)
Defines custom Material 3 color palettes for light and dark modes, utilizing high-contrast, premium dark surfaces and vibrant accents.

#### [NEW] [theme/theme.ts](file:///home/namnk/ws/github/kn-calculator/src/theme/theme.ts)
Exports combined React Native Paper MD3 light/dark themes with configured typography and custom colors.

---

### Phase 5: Navigation & Components

#### [NEW] [navigation/AppNavigator.tsx](file:///home/namnk/ws/github/kn-calculator/src/navigation/AppNavigator.tsx)
Builds bottom-tab navigation for:
- Calculator (Main Display + Keypad + Quick History floating drawer)
- History Screen (Search, FlashList, multi-select deletion, restore, copy functions)
- Favorites Screen (Pinned expressions list)
- Settings Screen (Selection of separators, sound/vibe toggles, theme settings)

#### [NEW] [components/CalcButton.tsx](file:///home/namnk/ws/github/kn-calculator/src/components/CalcButton.tsx)
High-performance button component supporting:
- Material ripple effect.
- Color variants (Primary, Secondary, Tertiary, Outlined) matching MD3 buttons.
- Scale animation via `react-native-reanimated`.
- Haptics and sound clicks on press.

#### [NEW] [components/Display.tsx](file:///home/namnk/ws/github/kn-calculator/src/components/Display.tsx)
Large, highly accessible mathematical expression display:
- Supports swipe gestures (swipe left to delete last token).
- Custom sizing based on input length to prevent text overflow.
- Displays live result in real time.

#### [NEW] [components/HistoryItemRow.tsx](file:///home/namnk/ws/github/kn-calculator/src/components/HistoryItemRow.tsx)
Includes swipeable actions (`react-native-gesture-handler`) to delete an item, tap to restore, press-and-hold to copy, and pin to favorites.

---

### Phase 6: Screens Integration

#### [NEW] [screens/CalculatorScreen.tsx](file:///home/namnk/ws/github/kn-calculator/src/screens/CalculatorScreen.tsx)
Layout that positions the large Display, memory operations bar, and large button keypad responsive to size changes. Integrates external keyboard handlers.

#### [NEW] [screens/HistoryScreen.tsx](file:///home/namnk/ws/github/kn-calculator/src/screens/HistoryScreen.tsx)
Searchable dashboard for historical calculations with swipe gestures and bulk delete options.

#### [NEW] [screens/PinnedScreen.tsx](file:///home/namnk/ws/github/kn-calculator/src/screens/PinnedScreen.tsx)
Shows tagged/favorite expressions for quick reuse.

#### [NEW] [screens/SettingsScreen.tsx](file:///home/namnk/ws/github/kn-calculator/src/screens/SettingsScreen.tsx)
Provides full control over precision settings, decimal and grouping separators, audio/haptic feedback, and theme modes.

#### [NEW] [hooks/useExternalKeyboard.ts](file:///home/namnk/ws/github/kn-calculator/src/hooks/useExternalKeyboard.ts)
A React hook listening to native keyboard inputs, binding `Enter` to equal, `Backspace` to backspace, `Delete` / `Escape` to clear, and numbers/operators to matching inputs.

---

## Verification Plan

### Automated Tests
We will add test scripts to verify the core domain logic:
```bash
npm run test
```
Tests will verify:
- Expression parser evaluations (percentage, negative numbers, parenthesis grouping, decimals).
- Value formatting (thousands separators, customized decimal commas/dots, precision truncation).
- Store updates (state persistence, history limits).

### Manual Verification
- **Visuals**: Reviewing dark and light Material 3 theme scaling on simulated devices.
- **Gestures**: Testing swipe-to-delete last token on the Display, swipe-to-delete history items.
- **Keypad**: Testing haptic feedback, sound triggers, and rapid inputs.
- **Offline Sync**: Toggling offline mode to verify calculations and history persist without network access.
