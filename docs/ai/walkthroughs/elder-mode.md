# Walkthrough - History Scroll gesture Refinement

We have adjusted the layout to ensure swiping and scrolling on the history logs is extremely smooth:

1. **Uninterrupted Scroll Gestures:**
   - Replaced the screen-wide parent `Pressable` wrapping in [CalculatorScreen.tsx](file:///home/namnk/ws/github/kn-calculator/src/screens/CalculatorScreen.tsx) with a standard `<View style={styles.root}>`.
   - This ensures swipe/touch events propagate directly to the history `ScrollView` instead of being intercepted by a parent press responder, allowing the user to swipe and scroll on any region of the history log.
   - Wrapped the lower display area and the keypad in a dedicated `<Pressable style={styles.lowerContainer}>` so that taps on the keypad or display area still correctly trigger the hidden keyboard focus.

2. **Visible Scroll Indicator:**
   - Changed `showsVerticalScrollIndicator` from `false` to `true` on the history `ScrollView` inside [CalculatorScreen.tsx](file:///home/namnk/ws/github/kn-calculator/src/screens/CalculatorScreen.tsx) to display the scrollbar when scrolling.

---

## Verification & Clean Status

- **Automated tests** run successfully: `pnpm test` passes all 27 assertions.
- **Type safety check** runs successfully: `pnpm typecheck` (`tsc --noEmit`) passes with no errors.
- **Linter rule compliance** is fully satisfied: `pnpm lint` runs clean with zero warnings or errors.
