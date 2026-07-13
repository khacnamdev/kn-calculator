# Development Guide

This document outlines the local development setup, debugging workflows, and common solutions for developers contributing to `kn-calculator`.

---

## 🛠 Required Tools

Before starting, install the following development utilities on your host system:

1. **Node.js:** v18.x or v20.x (LTS recommended)
2. **Package Manager:** `pnpm` (highly recommended; project has a lockfile configured for pnpm)
3. **Expo CLI:** Pre-configured via package scripts. You do not need to install it globally.
4. **Android Environment:**
   - [Android Studio](https://developer.android.com/studio)
   - Android SDK Platform 34 or higher
   - Android Virtual Device (AVD) / Emulator
5. **iOS Environment (macOS only):**
   - [Xcode](https://developer.apple.com/xcode/)
   - CocoaPods (`pod install` setup)
   - Command Line Tools installed

---

## 💻 Local Development Setup

Follow these commands to configure your local developer workspace:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/khacnamdev/kn-calculator.git
   cd kn-calculator
   ```

2. **Install node dependencies:**
   ```bash
   pnpm install
   ```

3. **Verify the environment configuration:**
   ```bash
   pnpm run typecheck
   ```

---

## 🚀 Running the Application

Start the Metro bundler to run the application:

```bash
pnpm start
```

From the Metro interactive terminal menu, or using direct script calls, launch your target runtime:

- **Android Emulator:** Run `pnpm android` (automatically opens the emulator and builds the debug version)
- **iOS Simulator:** Run `pnpm ios` (automatically opens Xcode Simulator and installs the application)
- **Web App:** Run `pnpm web` to test in-browser layouts.
- **Physical Device:** Install the **Expo Go** application on your iOS/Android phone, and scan the QR code displayed in the terminal after running `pnpm start`.

---

## 🔍 Debugging Guide

- **Developer Menu:** Press `Ctrl+M` (Windows/Linux emulator) or `Cmd+D` (iOS Simulator) to toggle the Expo Developer Menu.
- **Chrome DevTools:** You can debug Javascript threads and inspect states via Chrome by clicking "Debug Remote JS" or starting the debugger via `j` in the Metro console.
- **React DevTools:** Run React DevTools locally to inspect component trees:
  ```bash
  npx react-devtools
  ```
- **Zustand State Inspection:** You can log changes inside the store definitions by appending standard middleware loggers to the stores in `src/store/calculatorStore.ts`.

---

## 📂 Folder Structure Explanation

Here is the directory map of the source workspace:

* **`src/components/`**
  Houses reusable React Native UI items such as discrete selection rows, custom steppers, and layout dividers.
* **`src/constants/`**
  Defines hardcoded sizes, padding spacing, or standard keys used across screens.
* **`src/hooks/`**
  Contains custom hooks (e.g. `useExternalKeyboard` for intercepting hardware keys).
* **`src/i18n/`**
  Maintains dictionaries for translation tags (`translations.ts`) and localization custom hooks.
* **`src/navigation/`**
  Configuration parameters, route types, and navigator setups (`AppNavigator.tsx`).
* **`src/screens/`**
  Holds the main layouts (Calculator, Settings, history size slider adjustments).
* **`src/services/`**
  Core business modules. The Parser utility evaluates math syntax trees.
* **`src/store/`**
  Manages Zustand state and settings variables with AsyncStorage adapters.
* **`src/types/`**
  Interfaces detailing Settings and state schemas.
* **`src/utils/`**
  Helper functions (e.g., locale-compliant numeric grouping).

---

## ❓ Common Issues and Solutions

### 1. `ReferenceError: window is not defined` inside Jest tests
* **Cause:** Zustand storage or dependencies accessing global browser objects in Node.js test scripts.
* **Solution:** Mock standard browser adapters inside test files. In `calculatorStore.test.ts`, we mock AsyncStorage to bypass this error:
  ```typescript
  jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
  }));
  ```

### 2. Android build failures related to Gradle cache
* **Cause:** Corrupt local Gradle workspace files.
* **Solution:** Clean the Android build folder:
  ```bash
  cd android
  ./gradlew clean
  ```

### 3. Metro Bundler cache issues after updating package.json
* **Cause:** Cached modules loaded by Metro.
* **Solution:** Clear Metro bundler cache when starting the server:
  ```bash
  pnpm start --clear
  ```
