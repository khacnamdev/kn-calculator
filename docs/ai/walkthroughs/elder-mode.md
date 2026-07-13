# Walkthrough - Display Operator Spacing & Font Weight Refinement

We have adjusted and refined display styles for expressions:

1. **Closer Operator Spacing:**
   - Modified `formatExpression` inside [formatter.ts](file:///home/namnk/ws/github/kn-calculator/src/utils/formatter.ts) to format expressions without spaces around operators (e.g. `36+36` instead of `36 + 36`).
   - This aligns the active typing and final expression displays with the non-spaced spacing structure of history list rows.

2. **Thinner Expression Font Weight:**
   - Set the font weight of the active expression to `'500'` (thinner) inside [CalculatorScreen.tsx](file:///home/namnk/ws/github/kn-calculator/src/screens/CalculatorScreen.tsx) and [ExpressionFontSizeScreen.tsx](file:///home/namnk/ws/github/kn-calculator/src/screens/ExpressionFontSizeScreen.tsx).
   - The result (`72`) remains `'bold'` (`'700'`), creating a clear visual contrast and hierarchy.

---

## Verification & Clean Status

- **Automated tests** run successfully: `pnpm test` passes all 27 assertions.
- **Type safety check** runs successfully: `pnpm typecheck` (`tsc --noEmit`) passes with no errors.
- **Linter rule compliance** is fully satisfied: `pnpm lint` runs clean with zero warnings or errors.
