# Security Policy

We take security vulnerabilities seriously and strive to maintain a safe environment for all our users. This document outlines our security policies and reporting guidelines.

---

## 🛡 Supported Versions

Security updates are actively applied to the following software versions:

| Version | Supported | Notes |
| :--- | :--- | :--- |
| `1.0.x` | Yes | Active release branch |
| `< 1.0.0` | No | Legacy preview releases |

---

## ✉ How to Report a Vulnerability

If you discover a security vulnerability, please do **not** open a public issue. Instead, report it privately:

* Email the maintainers directly at: **security@khacnamdev.com** (replace with repository-specific email if configured)
* Provide a detailed description of the vulnerability, including:
  * Steps to reproduce the exploit.
  * The potential impact.
  * The system specifications/runtimes where it was discovered.

We will acknowledge your report within **48 hours** and provide a timeline for addressing the issue.

---

## 🤝 Responsible Disclosure Guidelines

To protect our users, we ask that you follow these responsible disclosure principles:

1. **Private communication:** Give us reasonable time to investigate and patch the issue before making any public disclosures.
2. **Do not exploit:** Do not attempt to access user data, modify history states, or exploit the vulnerability beyond what is necessary to confirm its presence.
3. **Cooperation:** Work with the maintainers to verify the patch before publishing vulnerability write-ups.

---

## 🔒 Security Best Practices

When developing and running `kn-calculator`, we enforce these guidelines:

* **Dependency Audits:** We regularly execute security scans on our package dependencies:
  ```bash
  pnpm audit
  ```
* **No Secret Storage:** Never commit database URLs, private API keys, or personally identifiable information (PII) into the repository codebase. Refer to environmental parameters or configuration wrappers if third-party APIs are integrated in future roadmaps.
* **Input Sanitization:** The core mathematical parser (`Parser.ts`) strictly validates all expressions before parsing or executing them to prevent code injection issues.
