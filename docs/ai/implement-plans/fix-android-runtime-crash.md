# Android Runtime Crash Fix Plan

Diagnose and resolve the immediate Android app runtime crash `[runtime not ready]: TypeError: undefined cannot be used as a constructor`.

## Root Cause Analysis

Based on initial research and `npx expo-doctor` output:
- The app uses **Expo SDK 57** and **React Native 0.86.0**.
- **React Native Reanimated v4 (4.5.0)** is installed, which requires `react-native-worklets` as a peer dependency. This dependency is missing from the project.
- **Expo Font (`expo-font`)** is also missing as a required peer dependency of `@expo/vector-icons`.
- There are major version mismatches reported by Expo:
  - `expo-clipboard` is installed at `7.0.1`, but Expo SDK 57 expects `~57.0.0`.
  - `@expo/vector-icons` is installed at `14.1.0`, but Expo SDK 57 expects `^15.0.2`.
- When the bundle loads, Reanimated tries to initialize its native bindings. Because `react-native-worklets` is missing, the underlying classes or module constructor functions are `undefined`, leading to the `TypeError: undefined cannot be used as a constructor` runtime crash.

## Proposed Changes

### Dependencies & Configuration

#### [MODIFY] [package.json](file:///home/namnk/ws/github/kn-calculator/package.json)
- Add/update required peer dependencies: `react-native-worklets` and `expo-font`.
- Correct the versions of `expo-clipboard` and `@expo/vector-icons` to align with Expo SDK 57 expectation.
- Align other packages if flagged during diagnostic runs.

## Execution Steps

1. **Install Dependencies & Fix Mismatches**:
   - Run `pnpm install`.
   - Run `npx expo install react-native-worklets expo-font` to install missing peer dependencies.
   - Run `npx expo install --check` or manually correct package.json to match Expo SDK 57 requirements (fixing `expo-clipboard` and `@expo/vector-icons`).

2. **Verify Configuration & Diagnostics**:
   - Run `npx expo-doctor` and ensure 100% checks pass.
   - Run `pnpm lint` and resolve all lint errors or warnings.
   - Run `npx tsc --noEmit` and resolve all TypeScript compilation errors.

3. **Clean Cache & Build/Launch**:
   - Run `pnpm exec expo start --clear` to start Metro with a cleared cache.
   - Run `pnpm run android` to build and launch the Android application in the emulator.

## Verification Plan

### Automated Tests
- `npx expo-doctor` (Expect: All checks pass)
- `pnpm lint` (Expect: Zero errors and warnings)
- `npx tsc --noEmit` (Expect: Zero TypeScript compilation errors)

### Manual Verification
- Launch the development build on Pixel 8.
- Verify that the app opens successfully with no red screen or runtime exception console logs.
