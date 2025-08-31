# Contributing

Thanks for your interest in contributing!

## Getting Started
- Read `README.md` and `docs/README.md` for a quick map of the docs
- Follow `docs/developer-handbook.md` and `docs/ENVIRONMENT-SETUP.md` to set up your environment
- Skim `docs/developer-handbook.md` and `docs/code-standard.md`

## Workflow
- Create a branch from `main` (or `develop` if used): `feature/concise-name`
- Keep changes small and focused; write tests along with code
- Update diagrams/specs when architecture changes
- Open a PR using the template and complete the checklist

## Commit Messages
- Use conventional commits (e.g., `feat: ...`, `fix: ...`, `docs: ...`)

## Code Style
- TypeScript everywhere (with pragmatic interop for specific 3D libs)
- Lint/typecheck before pushing: `npm run lint && npm run typecheck`
- i18n: no hardcoded UI strings; update all locales

## Security
- Never commit secrets; use `.env.example` for placeholders
- Follow SECURITY.md for reporting vulnerabilities

## Questions
- Open a discussion or ping maintainers in your PR
