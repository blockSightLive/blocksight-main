# Security Policy

## Supported Versions
This is an active project in development. Security updates apply to `main` and any maintained release branches.

## Reporting a Vulnerability
- Please email security@blocksight.live with details and a proof-of-concept when possible.
- Do not open public issues for vulnerabilities.
- We aim to acknowledge within 72 hours and provide a remediation timeline.

## Guidelines
- Do not test against production without written permission.
- Avoid actions that could impact availability or integrity of systems.
- Respect privacy; do not access user data.

## Baseline Practices (developers)
- No secrets committed to code or logs.
- Update `.env.example` when configuration changes.
- Keep dependencies updated; run security scans in CI.
- Follow `docs/code-standard.md` and use contract validation on external inputs.
