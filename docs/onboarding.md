# Developer Onboarding Guide

Welcome! This guide gets you productive quickly and safely.

## Week 0 (Setup)
- Read: `README.md` → Project Overview; `docs/developer-handbook.md` → How to use + Glossary
- Skim: `project-documents/00-model-spec.md`, `01-development-roadmap.md`, `01-execution-checklists.md`
- Environment (no installs yet if the repo is still scaffolding):
  - Ensure Node 20+, npm 9+, Docker (optional for Redis)
  - Clone with submodules: `git clone --recursive ...`
  - If using Redis locally: `npm run services:redis:start` (optional)
- Tools: VS Code with ESLint, Prettier, Mermaid preview

## Day 1–2 (Architecture Literacy)
- Diagrams: open `project-documents/system-diagrams/*` and read notes under each diagram
- Read i18n section in `docs/developer-handbook.md`; avoid hardcoded UI text
- Read Backend Initialization Plan (Express + ws)

## Day 3–5 (First Tasks)
- Pick a “good first issue” labeled ticket
- Follow the Micro-cycle (45–60 min) in `docs/developer-handbook.md` for each session
- Keep diffs small; request early review if touching security/consensus/performance

## Workflow
- Branching: `feature/<concise-name>`; conventional commits
- PRs: link issues; include checklist and short “What/Why/Risks/Rollback”
- CI (after workflows exist): make sure checks are green (typecheck/lint/test/build)

## i18n Quick Rules
- Never hardcode UI strings; add to `frontend/src/i18n/locales/*/translation.json`
- Validate RTL rendering for `he` locale (mirrored layout, icon direction)

## Troubleshooting
- Type errors pre-install: see temporary shims notes in `docs/developer-handbook.md`
- Diagram export issues: `npm run docs:diagrams`
- Redis optional; if not running, cache reads fall back to live data

## Ask for help
- Mention the module owner in your PR
- Use the team channel; pair for tricky bits
