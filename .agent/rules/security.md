# Zero-Trust Security & Data Protection (security.md)

This document governs the security requirements, data protection boundaries, and log-safeguarding rules for all code written, refactored, or configured within this workspace.

---

## 1. Zero-Trust Input Validation

All data originating outside the immediate execution context—including HTTP parameters, headers, database entries, CLI inputs, message queues, or config files—must be treated as untrusted and potentially malicious.

### Validation Principles:
1.  **Parse, Don't Validate**: Where possible, parse input strings directly into typed objects using schemas (e.g., Zod, JSON Schema). Avoid writing custom regex validations for complex structures.
2.  **Strict Whitelisting**: Define exact schemas containing acceptable types, values, lengths, and patterns. Never rely on blacklists (filtering known bad inputs).
3.  **Sanitize Output Contexts**:
    *   Avoid raw HTML rendering (prevents XSS). Use frameworks that escape values by default.
    *   Prevent SQL Injection by always using parameterized queries, ORMs, or query builders. Never construct SQL queries via raw string concatenation.
    *   Prevent Command Injection by avoiding system execution calls (`exec`, `system`) with unescaped input string elements.

---

## 2. Secrets & Credential Management

No sensitive keys or configurations should ever reside in source files.

### Rules:
*   **Zero Credentials in Code**: Never commit passwords, private keys, authorization tokens, API keys, database URLs, or security salts.
*   **Environment Injection**: Always load credentials dynamically from environment variables (`process.env` / system environment) or secure key vaults.
*   **Local Scoping**: Use local `.env` files for development and add `.env`, `.env.local`, and other credential stores to the root `.gitignore` file immediately.

---

## 3. Data Protection & Anti-Leakage

We must protect Personally Identifiable Information (PII), payment data (PCI), and system metadata from leaking into monitoring systems, debug logs, or crash metrics.

### Logger Restrictions:
*   **No Sensitive Logs**: Never log the following parameters:
    *   Passwords or verification tokens.
    *   Credit card numbers, CVVs, bank details.
    *   Session cookies or bearer tokens.
    *   Full names, emails, physical addresses, or phone numbers unless specifically tokenized/hashed.
*   **Structured Redaction**: Use structured logging libraries with default redaction hooks to automatically filter keys like `password`, `token`, `secret`, `authorization`, `email`, and `ssn`.

---

## 4. Supply Chain & Dependency Safety

*   **Audit Lockfiles**: Never modify `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, or `poetry.lock` manually. Always let package managers generate lockfiles.
*   **Audit Dependencies**: Run regular vulnerability scans (e.g., `npm audit`, `snyk`) and block merge operations on packages containing high-severity vulnerabilities.
*   **No Unverified Libraries**: Do not introduce obscure third-party libraries for trivial operations (e.g., string padding or simple array manipulation). Write local utilities or use standard platform methods.
