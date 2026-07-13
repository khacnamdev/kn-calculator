# 🚀 kn-calculator

A modern, highly performant, and feature-rich mobile calculator application built using React Native, Expo, and TypeScript. The application features a clean, responsive user interface with support for persistent history logs, multiple locale settings, theme customisation, custom font scaling, and a dedicated **Elder Friendly Mode** with bold, oversized keys for increased readability.

---

## 📱 Features

- **Arithmetic Core:** High-precision decimal calculations powered by a custom mathematical expression parser.
- **Elder Friendly Mode:** One-tap toggle for larger layouts, bold button labels, and unscrolled layout locks optimized for senior users.
- **Granular Sizing Customisation:** Separate dedicated settings screens with custom iOS-style sliders to customize history, active input expressions, and active results font sizes.
- **Keypad Tactility:** Optional haptic vibration feedback on every keypress.
- **Calculation History:** Persistent historical logs with customizable capacity limits and auto-save capabilities.
- **Multilingual Support:** Fully localised in English and Vietnamese.
- **Keyboard Support:** Full external/hardware keyboard event intercepting and focus management.
- **Aesthetic Flexibility:** Support for Light, Dark, and System-matching themes.

---

## 🛠 Tech Stack

- **Core Framework:** [Expo (SDK 54)](https://expo.dev/) & [React Native (0.81.x)](https://reactnative.dev/)
- **Programming Language:** [TypeScript](https://www.typescriptlang.org/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Navigation:** [React Navigation (v7)](https://reactnavigation.org/)
- **UI & Layout:** React Native stylesheets & [React Native Paper](https://reactnativepaper.com/)
- **Persistence:** [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage)
- **Testing:** [Jest](https://jestjs.io/) & [ts-jest](https://github.com/kulshekhar/ts-jest)

---

## 🏗 Project Architecture Overview

The codebase is organized following a modular structure with strict separation of concerns:

```
kn-calculator/
├── .github/             # GitHub CI/CD Workflows (Lint, Typecheck, Jest, Auto-Promotion)
├── assets/              # Static media assets, icons, and splash screens
├── docs/                # Project documentation and AI implementation plans
├── src/                 # Main Source Code
│   ├── components/      # Reusable UI elements (HistoryItemRow, Stepper, etc.)
│   ├── constants/       # App-wide fixed dimensions, layout parameters, and configurations
│   ├── hooks/           # Custom React hooks (keyboard listener, translation, navigation)
│   ├── i18n/            # Internationalisation dictionary translations and hook
│   ├── navigation/      # Navigation stack configurations, route mappings, and parameter types
│   ├── screens/         # Main application screen components (Calculator, Settings, Sizing)
│   ├── services/        # Business logic services (custom Parser utility)
│   ├── storage/         # MMKV or AsyncStorage persistent storage adapters
│   ├── store/           # Zustand global state stores (CalculatorState, SettingsState)
│   ├── theme/           # Color palettes, styles, and typography tokens
│   ├── types/           # App-wide TypeScript interfaces and schemas
│   └── utils/           # Helper utility functions (numeric formatting, time helpers)
├── App.tsx              # Application entry point wrapping providers
├── app.json             # Expo application configuration manifest
└── index.ts             # Registry entry point
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
* **Node.js** (v18 or higher recommended)
* **pnpm** (preferred package manager)
* **Android Studio** (for Android emulation) and/or **Xcode** (macOS only, for iOS emulation)
* **Expo Go** mobile application (for testing on physical devices)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/khacnamdev/kn-calculator.git
   cd kn-calculator
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

---

## 💻 Development Setup

### Available Scripts

Run the following scripts from the project root using `pnpm`:

| Command | Action |
| :--- | :--- |
| `pnpm start` | Launches the Expo Metro bundler server |
| `pnpm android` | Builds the app and runs it on a connected Android Emulator / Device |
| `pnpm ios` | Builds the app and runs it on an iOS Simulator (macOS only) |
| `pnpm web` | Runs the web version of the calculator in your local browser |
| `pnpm test` | Executes Jest unit test suite |
| `pnpm run test:ci` | Runs Jest unit tests in CI/non-interactive mode |
| `pnpm run lint` | Runs the Expo/ESLint linter to verify code formatting guidelines |
| `pnpm run typecheck` | Runs the TypeScript compiler (`tsc`) to verify type safety |

### Environment Configuration

By default, the application is pre-configured to run out of the box. Key settings (precision bounds, limits, localization) are set inside the persistent Zustand settings schema. You can customize the application's package specifications and metadata directly in `app.json`.

---

## 📸 Screenshots

| Standard Layout | Elder Mode Active | Settings panel |
| :---: | :---: | :---: |
| *[Screenshot Placeholder]* | *[Screenshot Placeholder]* | *[Screenshot Placeholder]* |

---

## 🗺 Roadmap

* [x] **Discrete Font Sizing Sliders:** Custom iOS-style sliders for history, results, and active expression sizes.
* [x] **Keyboard Interceptor:** Full support for typing mathematical equations using physical hardware keyboards.
* [x] **Enhanced Accessibilities:** Over-sized key targets and unscrolled layouts.
* [ ] **Scientific Functions:** Adding a secondary panel for advanced trigonometric and algebraic calculations.
* [ ] **Custom Calculation Export:** Exporting history logs as CSV/PDF files.
* [ ] **Local Voice Over:** Speech synthesis reading results aloud for visually impaired users.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Please read [CONTRIBUTING.md](CONTRIBUTING.md) to learn about our branch naming conventions, commit guidelines, and pull request requirements.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
