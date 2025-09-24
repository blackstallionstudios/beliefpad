# Security Policy

Thank you for helping keep this project and its users safe.

## Reporting a Vulnerability

- Please report security issues privately to: prolandself@gmail.com
- Include a detailed description, affected versions/branches, reproduction steps, impact, and any suggested remediation.
- If possible, include minimal proof-of-concept code or screenshots. Do not include sensitive user data.
- We will acknowledge receipt within 3 business days.

## Disclosure Policy

- We follow a coordinated disclosure approach.
- Please allow us a reasonable timeframe to investigate, validate, and release a fix before public disclosure.
- We aim to provide a remediation or mitigation within 30 days for high/critical issues, 60 days for medium, and 90 days for low severity findings. Timelines may vary depending on complexity.

## Scope

Issues related to the following are in scope:
- Application source in this repository and its published artifacts
- Client-side handling of sensitive data and exported documents
- Build and deployment configuration stored in this repo

Out of scope (unless a clear, demonstrable risk is shown):
- Vulnerabilities requiring physical access or non-standard environments
- Social engineering or account brute forcing without rate-limits bypass
- Denial of service that does not exploit a specific vulnerability (e.g., volumetric DoS)
- Issues exclusively in third-party platforms outside our control

## Accepted Vulnerability Types (examples)
- Authentication and authorization flaws
- Sensitive data exposure (e.g., session data, PII) in logs, exports, or network
- Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF), Clickjacking
- Injection issues (e.g., DOM, code, HTML/JSON injection)
- Broken access control or privilege escalation
- Business logic vulnerabilities that lead to data integrity or confidentiality impact

## What to Avoid
- Do not access, modify, or delete user data beyond what is necessary to demonstrate an issue
- Do not perform actions that degrade service for other users
- Do not run automated scanners against production endpoints at high volume

## Safe Harbor

We will not pursue legal action against researchers who:
- Act in good faith to discover and report vulnerabilities
- Adhere to this policy and avoid privacy violations, service disruption, or data destruction
- Provide us a reasonable amount of time to remediate before public disclosure

## Handling Sensitive Data

- Please redact or anonymize any personal data in reports
- If a proof-of-concept requires sensitive content, coordinate privately via email first

## Dependencies and Supply Chain

If you find issues in our dependency configuration (e.g., vulnerable pinned versions), please include:
- Package name and version
- Vulnerability identifier (CVE/GHSA) if available
- Suggested safe upgrade path or mitigation

## Credit

If you would like recognition, include the name/handle you wish to be credited with. We are happy to acknowledge researchers after fixes are released.

---
Last updated: 2025-09-24
