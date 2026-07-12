# Workspace Routing Rules (AGENTS.md)

This file serves as the routing layer and startup gateway for all AI agents in this workspace. It specifies the project identity, rules for navigating the repository, and the strict Context Loading Order required to initialize the workspace context without causing context window bloat.

---

## 1. Project Identity (Configuration Placeholders)

Human engineers must update these details when bootstrapping this repository.

*   **Project Name**: `[ENTERPRISE_PROJECT_NAME]`
*   **Primary Technology Stack**: `[e.g., Node.js / TypeScript / React / PostgreSQL]`
*   **Core Business Domain**: `[e.g., E-commerce Checkout, Financial Ledger, Identity Provider]`
*   **Key Architectural Style**: `[e.g., Domain-Driven Design (DDD), Clean Architecture, Hexagonal, Monolith, Microservices]`
*   **Major External Integration Boundaries**: `[e.g., Stripe API, Auth0, AWS S3]`

---

## 2. Strict Context Loading Order

To prevent memory pollution and excessive token usage, the AI agent must load configuration files in the following order. Do not skip any step.

```
[1. GEMINI.md]       --> Read Persona & Constitution
       |
[2. AGENTS.md]       --> Read Project Identity & Routing Rules
       |
[3. System Overview] --> Read docs/architecture/system-overview.md
       |
[4. Task Ruleset]    --> Load specific rules (coding/git/security) based on current task
```

### Context Load Verification:
Upon completing this startup sequence, verify that you have:
1. Identified the current tech stack and architectural style.
2. Located the core codebase folders.
3. Loaded the specific rule file matching the active action (e.g., load `git.md` before making commits).

---

## 3. Repository Navigation Protocol

Agents must use the following standard practices to locate code assets and documentation:

### Code Mapping:
*   **Source Code Directory**: Navigate to `./src/` or `./lib/` depending on the language.
*   **Tests Location**: Look for `*.test.ts`, `*.spec.ts`, or a `tests/` / `__tests__/` directory adjacent to the source code.
*   **Domain Schemas / Types**: Look inside `src/types/` or database schemas under `db/` or `prisma/schema.prisma` to verify data models.

### Documentation Mapping:
*   **System Design & Architecture**: Read [system-overview.md](file:///home/namnk/ws/github/kn-calculator/docs/architecture/system-overview.md) for architectural structures.
*   **Design Shift Logs (ADRs)**: Scan `docs/decisions/` for existing Architecture Decision Records before designing new subsystems.
*   **API Contracts**: Read `docs/openapi/` to inspect active RESTful contracts before writing endpoints.

---

## 4. Operational Rules Router

Before performing specific tasks, you must load the matching operational rule from `.agent/rules/`:

| Active Task | Rule File to Load | Path |
| :--- | :--- | :--- |
| Writing Code, Refactoring, Creating Classes | **Coding Standards** | [.agent/rules/coding.md](file:///home/namnk/ws/github/kn-calculator/.agent/rules/coding.md) |
| Committing, Branching, PR Creation | **Git & PR Workflows** | [.agent/rules/git.md](file:///home/namnk/ws/github/kn-calculator/.agent/rules/git.md) |
| Handling user input, tokens, credentials, PII | **Zero-Trust Security** | [.agent/rules/security.md](file:///home/namnk/ws/github/kn-calculator/.agent/rules/security.md) |

---

## 5. AI Documentation Persistence

For every implementation request that requires planning or execution, always persist the generated artifacts into the repository.

### Output Directories:
*   **Implementation Plans**: `docs/ai/implement-plans/`
*   **Task Lists**: `docs/ai/tasks/`
*   **Walkthroughs**: `docs/ai/walkthroughs/`

### Required Files:
For a feature named `<feature-name>`, create or update:
*   [implement-plans/<feature-name>.md](file:///home/namnk/ws/github/kn-calculator/docs/ai/implement-plans/<feature-name>.md)
*   [tasks/<feature-name>.md](file:///home/namnk/ws/github/kn-calculator/docs/ai/tasks/<feature-name>.md)
*   [walkthroughs/<feature-name>.md](file:///home/namnk/ws/github/kn-calculator/docs/ai/walkthroughs/<feature-name>.md)

### Rules & Behaviors:
1.  **Always create these files** if they do not exist.
2.  **Always update the existing files** instead of creating duplicates.
3.  **Keep the conversation concise**; the repository files are the source of truth.
4.  **Update the task list** as work progresses.
5.  **Update the walkthrough** whenever implementation changes.
6.  **Do not leave implementation plans, task lists, or walkthroughs only in the chat**.
7.  **If work is interrupted**, ensure the repository reflects the latest progress.
