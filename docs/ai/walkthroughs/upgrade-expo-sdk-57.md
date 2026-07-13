# Walkthrough - Expo SDK 57 Upgrade

We have successfully restored the project to the correct workflow by upgrading back to Expo SDK 57:

1. **Upgraded Core Dependencies:**
   - Changed `"expo"` version to `^57.0.0` in [package.json](file:///home/namnk/ws/github/kn-calculator/package.json).
   - Ran `pnpm install` and `pnpm dlx expo install --fix` to update all related React Native and peer dependency packages to versions fully compatible with SDK 57:
     - `react` and `react-dom` -> `^19.2.3`
     - `react-native` -> `^0.86.0`
     - `react-native-reanimated` -> `^4.5.0`
     - `react-native-screens` -> `^4.25.2`
     - `react-native-safe-area-context` -> `^5.7.0`
     - `react-native-gesture-handler` -> `^2.32.0`
     - `react-native-svg` -> `^15.15.4`
     - `expo-clipboard`, `expo-font`, `expo-status-bar` -> `^57.0.0`

2. **Validation and Diagnostics:**
   - Ran `pnpm dlx expo-doctor`: 20/20 dependency and environment configuration checks passed successfully with zero issues.
   - Verified that automated tests (`pnpm test`), typechecks (`pnpm run typecheck`), and lint checks (`pnpm run lint`) all compile and execute cleanly with no issues.

3. **Added Git Branch Strategy Documentation:**
   - Created [docs/git-workflow.md](file:///home/namnk/ws/github/kn-calculator/docs/git-workflow.md) containing:
     - A branch map strategy (`main` for active stable development on SDK 57, and separate `legacy/expo-sdk-54` branches for device-specific legacy testing).
     - Best practices guidelines warning against changing core SDK versions on active branches per device.
