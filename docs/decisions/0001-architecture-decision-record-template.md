# Architecture Decision Record Template

This is a production-ready, markdown-standard ADR template. AI agents must use this template to document any structural modifications, new system layers, or dependency changes in the codebase.

---

# ADR-[XXXX]: [Descriptive Title of the Decision]

*   **Status**: `[Proposed | Approved | Rejected | Superceded By ADR-YYYY]`
*   **Date**: `[YYYY-MM-DD]`
*   **Deciders**: `[List of human developers, architects, and AI agent]`
*   **Consulted**: `[Stakeholders consulted during the design review]`

---

## 1. Context

Describe the background context, architectural problem, and technical challenges you are solving.
*   What is the current system state, and what issues are we facing?
*   What are the core business requirements or scale drivers prompting this change?
*   Are there any strict system constraints (such as costs, dependencies, latency budgets, team familiarity) we must operate within?

---

## 2. Options Considered

Outline the different technical designs, tools, or frameworks evaluated.

### Option A: [Name of Option A]
*   **Summary**: Brief technical layout.
*   **Pros**: Why this choice works.
*   **Cons**: The limitations or resource constraints.

### Option B: [Name of Option B]
*   **Summary**: Brief technical layout.
*   **Pros**: Why this choice works.
*   **Cons**: The limitations or resource constraints.

---

## 3. Decision

Identify the selected path and state the definitive rationale.
*   Why was the chosen option selected over the alternatives?
*   How does this choice align with the global constitution (`GEMINI.md`) and project conventions (`AGENTS.md`)?
*   What is the specific implementation scope of this change?

---

## 4. Consequences

Detail the direct impacts of executing this decision. These must be written honestly and objectively.

*   **Positive Consequences**:
    *   `[e.g., Improved unit test isolation, reduction in database query latency]`
*   **Negative Consequences (Trade-offs)**:
    *   `[e.g., Higher local memory consumption, complexity of maintaining a new caching tier]`
*   **Neutral Consequences / Tasks**:
    *   `[e.g., Need to update OpenAPI spec documentation, team training required on new state-management APIs]`

---

## 5. Security & Verification Impact

*   **Security Assessment**: How does this choice affect zero-trust boundaries or credential access paths?
*   **Testing Strategy**: How will we write regression and integration tests to ensure this logic remains correct across future code updates?
