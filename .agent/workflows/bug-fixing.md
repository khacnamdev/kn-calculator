# Workflow: Bug Fixing SOP (bug-fixing.md)

This document contains the strict, sequential Standard Operating Procedure (SOP) for investigating, replicating, fixing, and documenting bugs in this workspace.

---

<Sequence name="Bug Resolution Process">

  <Step number="1" name="Reproduction & Validation">
    Replicate the failure using the smallest possible isolated environment or mock test input.
    *   **Action**: Locate the failing stack trace, error logs, or user report details.
    *   **Verification**: Write a temporary script or manual trigger that consistently reproduces the issue. Do not attempt a fix until you have proven the bug exists and can trigger it at will.
  </Step>

  <Step number="2" name="Root Cause Analysis (RCA) & State Isolation">
    Trace the execution paths, variable modifications, and data structures involved in the failure.
    *   **Action**: Use debuggers, temporary logging, or code walkthroughs to isolate exactly which state transition or operation failed.
    *   **Analysis**: Check if the failure is caused by edge-case inputs, race conditions, unexpected null/undefined values, database locking issues, or third-party API downtime.
  </Step>

  <Step number="3" name="Establish Regression Test">
    Write an automated test that asserts against the failure.
    *   **Action**: Implement a test case reproducing the buggy input and proving that it currently fails.
    *   **Goal**: The test must fail locally with the exact error signature identified during replication.
  </Step>

  <Step number="4" name="Defensive Fix Implementation">
    Apply the fix to resolve the root cause.
    *   **Guidelines**: Maintain the existing programming paradigms (rules/coding.md) and security bounds (rules/security.md).
    *   **Safety**: Ensure that the fix does not introduce backward-incompatible changes, break other public APIs, or silently catch the error.
  </Step>

  <Step number="5" name="Verification & Regression Check">
    Run tests to prove the fix works and has not compromised other domains.
    *   **Action**: Run the regression test. Ensure it passes cleanly.
    *   **Check**: Run the full workspace test suite to verify no other features were broken.
  </Step>

  <Step number="6" name="Post-Mortem Logging">
    Document the bug and resolution to prevent future occurrences.
    *   **Action**: Write an entry describing:
        *   **Symptoms**: What was the visible behavior of the bug?
        *   **Root Cause**: What line/system state was the source of the issue?
        *   **Fix**: What changes were applied?
        *   **Prevention**: What rules, typing constraints, or test boundaries have been added to prevent this from returning?
  </Step>

</Sequence>
