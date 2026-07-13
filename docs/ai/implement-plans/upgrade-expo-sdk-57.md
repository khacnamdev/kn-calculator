# Implementation Plan - Upgrade to Expo SDK 57

This plan documents the transition of the `kn-calculator` repository back to Expo SDK 57 and details the Git branch strategy for testing legacy SDKs.

## User Review Required

> [!IMPORTANT]
> - Upgrading the Expo SDK will update core native packages like `react-native`, `react-native-reanimated`, and `react-native-screens` to match SDK 57 specs.
> - Testing on older devices running out-of-date Expo Go versions should be isolated to a dedicated legacy branch rather than downgrading the `main` branch.

## Proposed Changes

We will upgrade `expo` to `~57.0.0` and let Expo's package installer update and align all related dependencies.

### Dependency Management

#### [MODIFY] [package.json](file:///home/namnk/ws/github/kn-calculator/package.json)
- Upgrade `expo` key to `~57.0.0` (or the latest stable SDK 57 version).
- Upgrade dependency versions of `react-native` and other Expo package extensions using the Expo CLI validator (`expo install --fix`).

#### [NEW] [git-workflow.md](file:///home/namnk/ws/github/kn-calculator/docs/git-workflow.md)
- Create new repository documentation explaining the branch strategy for device-specific SDK testing.

#### [NEW] [upgrade-expo-sdk-57.md](file:///home/namnk/ws/github/kn-calculator/docs/ai/implement-plans/upgrade-expo-sdk-57.md)
- Persist this implementation plan inside the repository for tracking purposes.

---

## Migration Steps

1. **Update `package.json` Expo Version:**
   Change the `expo` dependency to `~57.0.0` or `^57.0.0`.
2. **Execute Expo Dependency Correction:**
   Run `pnpm dlx expo install --fix` to automatically align other react-native and peer dependencies to their SDK 57 matching versions.
3. **Verify and Resolve Version Conflicts:**
   Run `pnpm dlx expo-doctor` to analyze the upgraded lockfile and fix any warnings.
4. **Clean cache and start server:**
   Verify code builds correctly and start Metro with cleared bundle cache: `pnpm start --clear`.

---

## Git Workflow branching Strategy

To test on older devices without affecting stable development:

```
main (Expo SDK 57)
 └── Stable development branch for active work

legacy/expo-sdk-54 (Expo SDK 54)
 └── Dedicated branch for testing compatibility on old Expo Go clients
```

We will publish a dedicated guide at [docs/git-workflow.md](file:///home/namnk/ws/github/kn-calculator/docs/git-workflow.md) outlining these instructions.

---

## Verification Plan

### Automated Tests
- Run `pnpm run typecheck` to verify no TypeScript compilation errors on the new SDK versions.
- Run `pnpm run lint` to verify ESLint compliance.
- Run `pnpm test` to verify calculations and store unit tests pass on upgraded state APIs.

### Manual Verification
- Launch Metro server with `pnpm start --clear`.
- Verify the Android Emulator (Pixel 8) running Expo Go SDK 57 launches the project successfully.
