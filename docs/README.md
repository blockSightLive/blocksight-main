# Developer Docs Index

Use this index to find what you need fast.

## Recommended reading order (first week)
1. README.md (root): Project overview and CI/CD summary
2. docs/onboarding.md: Setup, week plan, first tasks
3. docs/developer-handbook.md: How to use this handbook + Glossary → Backend/i18n sections
4. project-documents/00-model-spec.md: What we’re building and why
5. project-documents/system-diagrams/*: Visualize the architecture

## Purpose-based navigation
- Getting started: docs/onboarding.md
- Daily work (how to code here): docs/developer-handbook.md
- Standards (naming, patterns, quality bars): docs/code-standard.md
- Automation (CI/CD and collaboration): docs/automation-playbook.md
- Install commands and post-install steps: docs/install-notes.md
- Bitcoin Core setup: docs/bitcoin-core-virtualbox-setup.md
- Electrs setup: docs/electrs-windows-setup.md
- **Current Infrastructure State**: See developer-handbook.md for validated network topology
- Testing stack: Jest + ts-jest + supertest (backend); wired in CI
- Architecture details: project-documents/00-model-spec.md and system-diagrams
- Roadmap and checklists: project-documents/01-development-roadmap.md and 01-execution-checklists.md

## Tips
- Prefer diagrams-first for non-trivial changes. Update diagrams and specs alongside code.
- Never hardcode UI strings; follow i18n rules in the handbook.
- Keep PRs small; run typecheck/lint/tests locally before push.
