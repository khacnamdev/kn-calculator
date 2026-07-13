# Walkthrough - Expanded Keypad Buttons via Spacing Adjustment

We have adjusted the layout parameters of the keypad to increase the tap targets:

1. **Reduced Spacing & Larger Buttons:**
   - Reduced the keypad container's horizontal padding from `16` to `8` inside [CalculatorScreen.tsx](file:///home/namnk/ws/github/kn-calculator/src/screens/CalculatorScreen.tsx).
   - Reduced the gap between keys within rows and between keypad rows from `8` to `4` (using `gap: 4`).
   - Recalculated the `BTN_SIZE` constant dynamically: `const BTN_SIZE = (Dimensions.get("window").width - 8 * 2 - 4 * 4) / 5;`. This leverages the saved padding and gap spaces to increase the diameter of the circular buttons (e.g. from `65.2`px to `71.6`px on standard 390px screens).
   - Updated double-width (`btnWide`) and double-height (`btnTall`) button calculations to use the new gap size: `BTN_SIZE * 2 + 4`.

---

## Verification & Clean Status

- **Automated tests** run successfully: `pnpm test` passes all 27 assertions.
- **Type safety check** runs successfully: `pnpm typecheck` (`tsc --noEmit`) passes with no errors.
- **Linter rule compliance** is fully satisfied: `pnpm lint` runs clean with zero warnings or errors.
