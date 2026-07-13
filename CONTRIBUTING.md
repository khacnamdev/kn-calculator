# Contributing to kn-calculator

First off, thank you for taking the time to contribute! Contributions are key to improving this project.

Please read the following guidelines to ensure a smooth workflow and clean repository history.

---

## 🍴 How to Fork and Clone

1. **Fork the repository** on GitHub by clicking the **Fork** button at the top right of the repo page.
2. **Clone your fork** to your local machine:
   ```bash
   git clone https://github.com/your-username/kn-calculator.git
   cd kn-calculator
   ```
3. **Configure the upstream remote** to stay updated with changes:
   ```bash
   git remote add upstream https://github.com/khacnamdev/kn-calculator.git
   ```

---

## 🌿 Branch Naming Convention

When creating a new branch, please follow our naming prefixes:

- `feature/` - for introducing new features (e.g. `feature/scientific-mode`)
- `bugfix/` - for fixing existing bugs (e.g. `bugfix/parentheses-spacing`)
- `hotfix/` - for critical issues in release branches (e.g. `hotfix/crash-on-async-storage`)
- `chore/` - for maintenance tasks, package upgrades, and tooling setups (e.g. `chore/eslint-update`)

---

## 💬 Commit Message Convention

We adhere to the [Conventional Commits](https://www.conventionalcommits.org/) specification. Every commit message must use a structured prefix:

* **`feat:`** A new feature (e.g., `feat: add separate result display font size setting`)
* **`fix:`** A bug fix (e.g., `fix: prevent divide by zero calculations`)
* **`docs:`** Documentation changes only (e.g., `docs: update development guide`)
* **`refactor:`** Code changes that neither fix a bug nor add a feature (e.g., `refactor: extract key listener hook`)
* **`test:`** Adding or updating tests (e.g., `test: verify parser decimal division`)
* **`chore:`** Maintenance, dependencies, or configuration changes (e.g., `chore: update pnpm version`)

Example commit:
```bash
git commit -m "feat(ui): enlarge calculator keypad buttons on normal mode"
```

---

## 🚀 Pull Request Requirements

Before submitting your PR, ensure it meets the following standards:

1. **Keep it focused:** Keep your Pull Request small and focused on a single issue or feature.
2. **Synchronize your branch:** Rebase your branch onto the latest `develop` or `main` branch to avoid conflicts.
3. **Run local validation:**
   - The code must compile without errors: `pnpm run typecheck`
   - The linter must pass: `pnpm run lint`
   - All unit tests must pass: `pnpm test`
4. **Link issues:** Reference any related issue in the PR description (e.g. `Closes #42`).
5. **Describe changes:** Provide a clear description of the modifications made, including screenshots of visual adjustments if applicable.

---

## 🔍 Code Review Rules

Every Pull Request must be reviewed by at least one maintainer. Code reviews verify:
* **Separation of concerns:** Ensure display layout logic is separated from business/calculation services.
* **Typing integrity:** No implicit `any` definitions. Use strict types in all interfaces.
* **Component reuse:** Avoid code duplication by reusing components from `src/components/`.
* **Performance overhead:** Verify that React components do not trigger redundant renders.
* **Accessibilities:** Ensure text scalability limits are respected when introducing new components.

---

## 💻 Coding Standards

- **Formatting:** ESLint and Expo rules are enforced. Running `pnpm run lint` will check for syntax issues.
- **Naming Conventions:**
  - Files representing React Components: PascalCase (e.g., `CalculatorScreen.tsx`).
  - Helper files, hooks, utilities: camelCase (e.g., `formatter.ts`, `useTranslation.ts`).
  - Style rules and components variables: camelCase.
- **Safety:** Always use defensive programming. Never swallow errors silently; log or propagate them.
