# Walkthrough: Android Runtime Crash Fixes

This document details the diagnoses, code refactorings, and validation steps performed to resolve the Android application runtime crash and build issues.

## 1. Root Cause & Fix Details

### A. JSI Runtime Instantiation Crashes (`TypeError: undefined cannot be used as a constructor`)
- **React Native Reanimated v4 (4.5.0)**: Required the missing `react-native-worklets` native module as a peer dependency. Without it, the Reanimated native bridges failed to instantiate.
  - *Fix*: Installed `react-native-worklets` and `expo-font` using `npx expo install`.
- **react-native-mmkv v4**: The modern v4 API utilizes Nitro Modules where `MMKV` is exported only as a type, and the `new MMKV(...)` constructor has been deprecated/removed in favor of the factory function `createMMKV()`. In addition, `.delete()` is renamed to `.remove()`. Instantiating `new MMKV` was resulting in runtime `TypeError` crashes.
  - *Fix*: Modified [mmkv.ts](file:///home/namnk/ws/github/kn-calculator/src/storage/mmkv.ts) to utilize `createMMKV` and `storage.remove`.

### B. Dependency Version Mismatches
- **Expo SDK 57**: Warned about outdated versions of `expo-clipboard` and `@expo/vector-icons`.
  - *Fix*: Ran `npx expo install --fix` which updated `expo-clipboard` to `~57.0.0` and `@expo/vector-icons` to `^15.1.1`.
- **Jest Globals**: `describe`, `test`, `expect`, `beforeEach` explicit imports in the test files could not be resolved by TypeScript because `@jest/globals` was missing from `devDependencies` under the pnpm workspace layout.
  - *Fix*: Installed `@jest/globals@^29.7.0` to devDependencies.

### C. TypeScript Type Safety Refactoring
- **Font Theme Clash**: The React Navigation theme's `fonts` property conflicted with React Native Paper's `fonts` property of type `MD3Typescale` when trying to pass a unified theme object.
  - *Fix*: Separated the themes into `PaperLightTheme`/`PaperDarkTheme` and `NavigationLightTheme`/`NavigationDarkTheme` in [theme.ts](file:///home/namnk/ws/github/kn-calculator/src/theme/theme.ts) and updated [App.tsx](file:///home/namnk/ws/github/kn-calculator/App.tsx).
- **Icon Name Union Typing**: Handled implicit string conversion issues for vector-icon names in [CalcButton.tsx](file:///home/namnk/ws/github/kn-calculator/src/components/CalcButton.tsx) and [AppNavigator.tsx](file:///home/namnk/ws/github/kn-calculator/src/navigation/AppNavigator.tsx) by explicitly casting or typing them using `React.ComponentProps<typeof MaterialCommunityIcons>['name']`.
- **StyleSheet & FlashList API Mismatches**:
  - Replaced the non-existent `StyleSheet.absoluteFillObject` with the standard `StyleSheet.absoluteFill` in [HistoryPanel.tsx](file:///home/namnk/ws/github/kn-calculator/src/components/HistoryPanel.tsx).
  - Removed the obsolete `estimatedItemSize` property from `<FlashList />` in `HistoryPanel.tsx`, `HistoryScreen.tsx`, and `PinnedScreen.tsx` as it is no longer required in FlashList v2.

### D. ESLint Warnings
- Removed a duplicate `react-native-gesture-handler` side-effect import in `App.tsx`.
- Removed an unused `runOnJS` import and added missing `useEffect` dependency array hooks in `HistoryPanel.tsx`.

## 2. Validation & Verification Results

All automated checks passed successfully:
- **npx expo-doctor**: Passed 20/20 checks.
- **pnpm lint**: Passed with 0 errors and 0 warnings.
- **npx tsc --noEmit**: Passed with 0 TypeScript compilation errors.

### Visual Verification
The development Metro bundler cache was cleared, the app successfully built, installed, and launched on the Pixel 8 Android emulator:

![App Launch Screenshot](/home/namnk/.gemini/antigravity-ide/brain/53ae2061-cdb3-4dda-83ff-6e6a75a5db8b/app_launch2.png)
