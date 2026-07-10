# Git Workflow & Commit Rules (git.md)

This document defines the strict version control guidelines, branching strategies, and commit message formats that all developers and agents must adhere to in this workspace.

---

## 1. Branch Naming Strategy

Branches must follow a strict, descriptive naming standard containing the ticket identifier and description.

### Prefix Conventions:
*   **Feature Branches**: `feature/[ticket-id]-[short-description]` (e.g., `feature/PROJ-102-user-auth`). Use for new features or capabilities.
*   **Bugfix Branches**: `bugfix/[ticket-id]-[short-description]` (e.g., `bugfix/PROJ-205-fix-jwt-expiration`). Use for resolving existing bugs or issues.
*   **Hotfix Branches**: `hotfix/[ticket-id]-[short-description]` (e.g., `hotfix/PROJ-911-database-pool-leak`). Use for emergency patches applied directly to production/main.
*   **Chore / Refactoring Branches**: `chore/[short-description]` or `refactor/[short-description]`. Use for non-functional codebase updates.

---

## 2. Conventional Commits Layout

Commits must follow the Conventional Commits specification. This ensures automated release notes generation and semantic versioning.

### Commit Format:
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Supported Types:
*   `feat`: A new feature or capability.
*   `fix`: A bug fix or patch.
*   `docs`: Documentation changes only.
*   `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
*   `refactor`: A code change that neither fixes a bug nor adds a feature.
*   `perf`: A code change that improves performance.
*   `test`: Adding missing tests or correcting existing tests.
*   `build`: Changes that affect the build system or external dependencies.
*   `ci`: Changes to CI configuration files and scripts.
*   `chore`: Infrastructure, tooling, or project-wide administrative changes.

### Example Commit Message:
```
feat(auth): add rate limiting handler to login endpoint

Implemented token bucket rate limiter to prevent brute-force attacks
on the active verification route.

Closes PROJ-103
```

---

## 3. Pull Request Self-Review Checklist

Before requesting human review or triggering a build pipeline, execute the following checklist.

- [ ] **Functional Verification**: Have all requirements in the ticket/feature description been met?
- [ ] **Test Coverage**: Do new files have unit tests covering at least 80% logic? Are regression tests written for bugs?
- [ ] **Security Scans**: Have you verified that no secrets, database tokens, private keys, or PII have been added to files or variables?
- [ ] **Linter & Formatting**: Have you run `npm run lint` / `npm run format` (or equivalent code formatter) on all modified files?
- [ ] **Documentation**: Have you updated the matching OpenAPI spec, architectural records (docs/), or system overview documents if code contracts or dependencies changed?
- [ ] **Backward Compatibility**: Have database models, public classes, or API endpoints remained fully compatible? (If breaking, is it documented in a new ADR?)
