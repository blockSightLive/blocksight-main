# Automation Playbook (CI/CD, QA, and Collaboration)

## Purpose
- Centralize how we automate repeatable tasks: linting, typechecking, tests, security scans, builds, deployments, releases, and documentation exports.
- Clarify what is one-time GitHub/repo setup vs. what each developer runs locally.

## Ownership model
- One-time (repository/organization level):
  - GitHub branch protections (protected `main`, required status checks)
  - CODEOWNERS and PR templates
  - GitHub Actions workflows in `.github/workflows/*.yml`
  - Secrets configured in repo/org settings (later phases)
- Per-developer (local machine):
  - Node/npm setup, local Docker (for Redis) if opted-in
  - Pre-commit hooks (Husky/lint-staged) once added
  - Running local checks before pushing (lint, typecheck, tests)

## What we automate (pipeline stages)
- Code Quality
  - Lint (ESLint + Prettier)
  - Typecheck (TypeScript `--noEmit`)
  - Formatting check (Prettier)
- Tests
  - Unit and integration (Jest, supertest for backend; later React tests)
  - Snapshot tests for i18n locales (later)
  - SQL function/view tests (snapshot/pgTAP) and Migration checks
  - Redis function tests (integration with timeouts)
- Security and Compliance
  - Dependency vulnerability scanning (e.g., npm audit or dedicated tools in CI)
  - SBOM generation (CycloneDX/SPDX) and license checks (later)
- Build
  - Compile backend/frontend
  - Artifact packaging (later phases)
  - Container image builds for unified Dockerfile
  - SQL migrations build/check (lint, dry-run)
  - Redis functions load/verify job (SHA/version)
- Documentation
  - Diagram exports (Mermaid CLI) for changed files (optional job)
- Deployment (later phases)
  - Staging: auto-deploy on `develop`
  - Production: manual approval or tagged release on `main`

## Proposed workflow files (to be added later)
- `.github/workflows/ci.yml`: lint, typecheck, test, build for all workspaces
- `.github/workflows/deploy-staging.yml`: staging deploy on `develop`
- `.github/workflows/deploy-production.yml`: production deploy on release/tag
- `.github/workflows/security-scan.yml`: dependency/security checks; SBOM generation

## Branch protections (recommended)
- Protected branch: `main`
  - Require PR approvals (2 reviewers; include a Bitcoin domain reviewer for consensus-related code)
  - Require status checks: lint, typecheck, test, build
  - Dismiss stale approvals on new commits; restrict force-push
- `develop` (if used): require checks; allow fast-forward merges from PRs

## PR templates and CODEOWNERS (recommended)
- `.github/pull_request_template.md`: include the Code Review Checklist from the Developer Handbook
- `CODEOWNERS`: assign review teams per area (backend, frontend, electrs integration, docs)

## Local automation (developer)
- Scripts (root): `dev`, `build`, `typecheck`, `lint`, `test`, `docs:diagrams`, `services:redis:*`
- Optional Git hooks (later):
  - pre-commit: lint-staged for changed files
  - commit-msg: conventional commits enforcement

## Git hygiene (.gitignore strategy)
- Root `.gitignore` excludes node_modules, build artifacts (`dist/`, `build/`, `coverage/`), caches, logs, and local env files (`.env*`, except `.env.example`).
- Each workspace (`backend`, `frontend`) has its own `.gitignore` tuned to its build system.
- Diagram exports (`project-documents/system-diagrams/exports/*.png|*.svg`) are ignored since source of truth is Mermaid in Markdown.
- Never commit secrets or machine-specific files; prefer documented examples and scripts.

## Secrets and environment (later phases)
- No secrets in code or CI logs
- Use repo/org GitHub Secrets for CI; use cloud secret manager for staging/production
- Document new env vars in `.env.example` and `README`

## Node version standardization
- `.nvmrc` pins the Node major version for local development and CI images.

## Releases (later phases)
- Tagged releases trigger `deploy-production.yml`
- Changelog generation from conventional commits
- SBOM attached to releases for compliance

## What’s one-time vs recurring
- One-time (maintainers): add workflows, branch protections, CODEOWNERS, PR template
- Recurring (every PR/commit): CI quality gates
- Recurring (developers): local `typecheck`, `lint`, `test` before push; pairing/code review

## Troubleshooting
- CI fails on typecheck: run `npm run typecheck -w <workspace>` locally and fix types
- CI fails on tests: run `npm test -w <workspace>`; update fixtures or adjust tests
- Formatting errors: run `npm run format`
- Diagram export errors: ensure Mermaid blocks are valid; run `docs:diagrams`
 - Container build errors: verify Dockerfile stages, ensure workspace builds locally before image build
