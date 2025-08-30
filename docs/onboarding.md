# Developer Onboarding Guide

/**
 * @fileoverview Developer onboarding guide for BlockSight.live
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-29
 * @lastModified 2025-08-29
 * 
 * @description
 * This guide provides step-by-step onboarding for new developers joining BlockSight.live.
 * The system is fully operational with frontend deployed to staging.
 * 
 * @dependencies
 * - README.md (project overview)
 * - docs/developer-handbook.md (development guidance)
 * - project-documents/00-model-spec.md (system overview)
 * - project-documents/01-development-roadmap.md (development strategy)
 * 
 * @state
 * ✅ CURRENT - Updated to reflect current system state
 * 
 * @todo
 * - Monitor for new features or configuration changes
 */

Welcome! This guide gets you productive quickly and safely.

## Week 0 (Setup)
- Read: `README.md` → Project Overview; `docs/developer-handbook.md` → How to use + Glossary
- Skim: `project-documents/00-model-spec.md`, `01-development-roadmap.md`, `01-execution-checklists.md`
- Environment (fully configured and operational):
  - Ensure Node 20+, npm 9+, Docker (optional for Redis)
  - Clone with submodules: `git clone --recursive ...`
  - If using Redis locally: `npm run services:redis:start` (optional)
  - **Frontend**: Already deployed to Vercel staging and fully operational
  - **Backend**: Local development environment with Docker
- Tools: VS Code with ESLint, Prettier, Mermaid preview

## Day 1–2 (Architecture Literacy)
- Diagrams: open `project-documents/system-diagrams/*` and read notes under each diagram
- Read i18n section in `docs/developer-handbook.md`; avoid hardcoded UI text
- Read Backend Initialization Plan (Express + ws - partially implemented)
- **Current Status**: Frontend fully operational, CoreRpcAdapter implemented, WebSocket hub operational

## Day 3–5 (First Tasks)
- Pick a “good first issue” labeled ticket
- Follow the Micro-cycle (45–60 min) in `docs/developer-handbook.md` for each session
- Keep diffs small; request early review if touching security/consensus/performance
 - Containers-first: after installs, prefer running via `docker-compose -f docker-compose.dev.yml up -d --build`

## Workflow
- Branching: `feature/<concise-name>`; conventional commits
- PRs: link issues; include checklist and short “What/Why/Risks/Rollback”
- CI (after workflows exist): make sure checks are green (typecheck/lint/test/build)
 - If a change affects runtime, update Dockerfile/compose and docs

## i18n Quick Rules
- Never hardcode UI strings; add to `frontend/src/i18n/locales/*/translation.json`
- Validate RTL rendering for `he` locale (mirrored layout, icon direction)
- **Note**: i18n system is fully implemented with EN/ES/HE/PT languages

## Troubleshooting
- Type errors pre-install: see temporary shims notes in `docs/developer-handbook.md`
- Diagram export issues: `npm run docs:diagrams`
- Redis optional; if not running, cache reads fall back to live data

## Ask for help
- Mention the module owner in your PR
- Use the team channel; pair for tricky bits
