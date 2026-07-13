# Walkthrough - Display Scaling & Text Sizing Refinement

We have adjusted and refined the text sizing logic for active calculation states:

1. **Relative Font Sizes:**
   - The active input expression (e.g. `365 + 3,652`) is now styled to always have a larger font than the live/final result (e.g. `4,017`).
     - Normal Mode: Result `fontSize: 36`, Expression `fontSize: 50`.
     - Elder Mode: Result `fontSize: 48`, Expression `fontSize: 72`.
   - While typing, the active input uses the larger expression size (`50` or `72`).

2. **Minimum Scale Boundaries:**
   - Configured `minimumFontScale` on the expression element (`40/50` in normal mode, `52/72` in Elder Mode) so that if the text scales down to fit, its minimum size is guaranteed to be at least `40` (normal) or `52` (elder), which is always at least 2 font sizes greater than the result's size (`36` / `48`).

3. **Flexible Input Space wrapping:**
   - Increased the maximum line limit `numberOfLines` of the active expression from `2` to `5`.
   - If a long expression wraps across multiple lines, the height of the display container dynamically grows up to 5 lines. Standard Flexbox scaling automatically shrinks the history list container to fit it seamlessly.

---

## Verification & Clean Status

- **Automated tests** run successfully: `pnpm test` passes all 26 assertions.
- **Type safety check** runs successfully: `pnpm typecheck` (`tsc --noEmit`) passes with no errors.
- **Linter rule compliance** is fully satisfied: `pnpm lint` runs clean with zero warnings or errors.
