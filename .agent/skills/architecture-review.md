# Capability Contract: Architecture Review (architecture-review.md)

This capability contract details how the AI agent performs architecture reviews for system designs, dependency introductions, and subsystem refactoring within this workspace.

---

## 1. Purpose

To evaluate proposed architectural modifications, package additions, or database schema shifts against the project's established conventions, system boundaries, and security constraints. This contract ensures all design decisions are verified and documented systematically.

---

## 2. When to Use

You must trigger this capability contract whenever you encounter:
*   Requests to install new core frameworks or dependencies (e.g., adding an ORM, a new caching client, or a validation library).
*   Proposals to refactor directory layers or split code into microservices/monorepos.
*   Modifications to database tables, column structures, or access patterns.
*   System designs for new end-to-end features requiring multiple classes, services, or APIs.

---

## 3. Required Context

Before starting the review, ensure you have loaded:
1.  **System Design SoT**: [system-overview.md](file:///home/namnk/ws/github/antigravity-enterprise-template/docs/architecture/system-overview.md).
2.  **Historic Decisions**: The existing ADR files located under `docs/decisions/`.
3.  **Active Schema**: The current database configuration, models, or prisma schema file.
4.  **Proposed Design/Ticket**: The feature specifications, schema proposals, or dependency changes requested by the user.

---

## 4. Expected Output Structure

Every architecture review must output an artifact structured exactly as follows:

### Title: Architecture Review: [Short Title]

#### Executive Summary
Provide a brief, high-level summary of the proposed change, its goal, and the recommended design path.

#### Architectural Options Evaluated
Detail the proposed option vs. any alternatives (including status quo).

#### Pros/Cons/Risks Matrix

| Option | Pros | Cons | Risks & Mitigations |
| :--- | :--- | :--- | :--- |
| **Option A (Proposed)** | - Clear benefit 1<br>- Clear benefit 2 | - Trade-off 1<br>- Trade-off 2 | - **Risk**: Potential latency increase.<br>- **Mitigation**: Add Redis caching. |
| **Option B (Alternative)** | - Benefit 1 | - Trade-off 1 | - **Risk**: Maintenance overhead.<br>- **Mitigation**: Outsource to managed service. |

#### ADR Reference Recommendation
Indicate whether this change warrants a new ADR (`docs/decisions/XXXX-adr-title.md`) and draft the key sections if required.

---

## 5. Review Quality Checklist

The output architecture review is only complete if you can mark all check items:

- [ ] **Dependency Proof**: Have you checked if an existing installed library can already perform this task?
- [ ] **Performance Assessment**: Have you analyzed the worst-case time/space complexity (e.g., potential database N+1 query patterns)?
- [ ] **Security Review**: Does this layout conform to the zero-trust input validation guidelines?
- [ ] **Scalability/Rollback**: Can this design be rolled back safely without data corruption if a production issue is encountered?
- [ ] **Stakeholder Alignments**: Are human decisions explicitly noted and referenced?
