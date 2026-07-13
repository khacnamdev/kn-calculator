# Git Branching Strategy & Expo SDK Testing Guide

This document describes the recommended Git branch workflow for managing Expo SDK versions and executing test runs on older devices.

---

## 🌿 Branching Strategy

Our repository maintains a single target SDK version across standard platforms (`main` branch). If temporary tests are required for older target environments, developers should branch out to a dedicated legacy branch rather than modifying the main development line.

```
main (Expo SDK 57 - Stable Development)
 └── Stable active codebase. Android, iOS, and Web always run on SDK 57.

legacy/expo-sdk-54 (Expo SDK 54 - Old Device Testing)
 └── Created only if testing legacy Expo Go clients on older devices is required.
```

---

## 🚫 Critical Guidelines for Expo SDK Versioning

### 1. Never Change Expo SDK Per Device
* **Rule:** Do not downgrade or modify the project's Expo SDK inside `package.json` to match a specific physical device or local emulator.
* **Reason:** Changing dependency versions directly in your workspace updates `package.json` and the lockfile. Committing these modifications will break build compiles, CI automation, and package resolves for other developers on different devices.

### 2. Expo Go Version Must Match Project SDK
* **Rule:** The version of the Expo Go mobile application installed on your physical device or emulator must align with the SDK version specified in the project.
* **Troubleshooting:** If you see the error `"The installed version of Expo Go is for SDK X. The project you opened uses SDK Y"`, you must:
  - Upgrading Expo Go (or the project) so they match.
  - Or run the project on a matching legacy branch that matches your device's Expo Go SDK support.

### 3. Unified Cross-Platform SDK Versions
* **Rule:** Android and iOS runtimes must always share the exact same Expo SDK version in the repository.
* **Reason:** Keeping different platforms on different SDK configurations results in incompatible peer dependencies (like React and React Native versions), breaking local builds.

---

## 🛠 How to Set Up a Legacy Branch for Old SDK Testing

If you need to test the application on an older device supporting only Expo SDK 54 (without impacting stable development):

1. **Create and switch to the legacy branch:**
   ```bash
   git checkout -b legacy/expo-sdk-54
   ```

2. **Downgrade Expo SDK:**
   Change `"expo"` back to the older version (e.g. `^54.0.0`) in `package.json`.

3. **Re-align legacy dependencies:**
   Run the Expo installer fix utility:
   ```bash
   pnpm install
   pnpm dlx expo install --fix
   ```

4. **Verify the legacy environment:**
   Verify that tests and compilation compile without errors on the legacy branch:
   ```bash
   pnpm run typecheck
   pnpm test
   ```

5. **Commit the changes:**
   ```bash
   git add package.json pnpm-lock.yaml
   git commit -m "chore(sdk): downgrade to Expo SDK 54 for legacy testing"
   ```

6. **Switch back when completed:**
   Once testing is complete, always switch back to the stable branch to resume active development:
   ```bash
   git checkout main
   pnpm install
   ```
