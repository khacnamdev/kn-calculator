# Downgrade to Expo SDK 54 & AsyncStorage Migration

This plan details the steps required to downgrade the project to Expo SDK 54 and swap the native C++ `react-native-mmkv` storage with `@react-native-async-storage/async-storage` so that the app can run directly on the standard Expo Go app on iPhone 11.

## Proposed Changes

### Storage Migration

#### [MODIFY] [mmkv.ts](file:///home/namnk/ws/github/kn-calculator/src/storage/mmkv.ts)
- Replace `react-native-mmkv` imports and instantiations with `@react-native-async-storage/async-storage`.
- Re-implement `zustandStorage` using AsyncStorage's asynchronous methods (`setItem`, `getItem`, `removeItem`).

### Dependencies & SDK Configuration

#### [MODIFY] [package.json](file:///home/namnk/ws/github/kn-calculator/package.json)
- Downgrade `"expo"` from `~57.0.4` to `~54.0.0`.
- Remove `"react-native-mmkv"` and `"react-native-worklets"` from dependencies.
- Add `"@react-native-async-storage/async-storage"` as a dependency.
- Run dependency resolution to auto-correct peer dependencies for SDK 54.

## Execution Steps

1. **Modify Storage Code**:
   - Update `src/storage/mmkv.ts` to implement AsyncStorage instead of MMKV.

2. **Downgrade Expo SDK & Packages**:
   - Edit `package.json` to change `"expo"` to `"~54.0.0"`.
   - Remove `"react-native-mmkv"` and `"react-native-worklets"`.
   - Add `"@react-native-async-storage/async-storage": "1.24.0"` (or run `npx expo install @react-native-async-storage/async-storage`).
   - Run `pnpm install` to update local lockfiles.
   - Run `npx expo install --fix` to automatically align all standard dependencies (like `react`, `react-native`, `react-native-reanimated`, `react-native-safe-area-context`, etc.) to match SDK 54.

3. **Verify Configuration & Compatibility**:
   - Run `npx expo-doctor` and verify all checks pass.
   - Run `pnpm lint` and verify no ESLint warnings or errors remain.
   - Run `npx tsc --noEmit` and fix any TypeScript compilation issues arising from library version changes.

4. **Test the Application**:
   - Clear Metro cache and run using `npx expo start --clear`.
   - Verify app launch and state persistence on the emulator / Expo Go.

## Verification Plan

### Automated Tests
- `npx expo-doctor` (Expect: All checks pass)
- `pnpm lint` (Expect: Zero errors and warnings)
- `npx tsc --noEmit` (Expect: Zero TypeScript compilation errors)

### Manual Verification
- Launch the Expo development server.
- Connect via Expo Go on iPhone 11 and verify that the application loads and functions correctly.
