# Workflow: Feature Development SOP (feature-development.md)

This document contains the strict, sequential Standard Operating Procedure (SOP) for developing and launching new features within this workspace. AI agents must execute these steps sequentially and avoid jumping straight to coding.

---

<Sequence name="Feature Development Lifecycle">

  <Step number="1" name="Research & Boundary Assessment">
    Identify and analyze all requirements. Locate existing modules, schemas, and dependencies inside the codebase.
    *   **Action**: Scan active modules to ensure no code duplication occurs.
    *   **Verification**: Check if the requested feature can be built on top of existing components.
  </Step>

  <Step number="2" name="Design-First & API Specifications">
    Before writing a single line of business logic, write the API schema and data models.
    *   **Action**: Update the OpenAPI spec in `docs/openapi/contract-template.yaml` or write database schema designs.
    *   **Review**: If the feature introduces breaking changes, write a new ADR draft inside `docs/decisions/` following the ADR template.
  </Step>

  <Step number="3" name="Test-Driven Drafts (TDD)">
    We write test cases first. This establishes the functional boundary for our implementation.
    *   **Action**: Create the test file (e.g., `feature.spec.ts` or `test_feature.py`) containing the core specifications and inputs/outputs.
    *   **Execution**: Run the newly created test suite. Verify that all tests fail initially as expected.
  </Step>

  <Step number="4" name="Defensive Logic Implementation">
    Implement the minimal required code to satisfy the functional requirements and make the tests pass.
    *   **Coding Rules**: Adhere strictly to the coding standards defined in `.agent/rules/coding.md` and the security guidelines in `.agent/rules/security.md`.
    *   **Safety**: Never use placeholders (e.g., `// TODO` or `/* fix later */`). Write complete, production-ready code.
  </Step>

  <Step number="5" name="Verification & Automated Checks">
    Verify code correctness, formatting, and performance characteristics.
    *   **Action**: Run the test suite. If tests fail, diagnose and fix until all assertions pass.
    *   **Commands**: Run linting (`npm run lint`), formatting (`npm run format`), and compiler type-checking.
  </Step>

  <Step number="6" name="Self-Review & Integration Preparation">
    Execute the Pull Request checklist before seeking code merging.
    *   **Action**: Refer to the review checklist in `.agent/rules/git.md`. Scan the git diff manually using a viewer to confirm no private configurations, credentials, or unused debug files are included.
    *   **Commit**: Write conventional commits detailing the scope and changes. Create the branch using the standard naming schema.
  </Step>

</Sequence>
