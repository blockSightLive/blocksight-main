# ADR 0001: Electrum Client vs Custom TCP Wrapper

## Status
Proposed (Phase 1 decision: start with electrum-client; revisit later)

## Context
We need an Electrum protocol client to communicate with electrs. Options: use an existing `electrum-client` library or build a bespoke TCP wrapper for full control.

## Decision
Start with `electrum-client` for MVP: faster integration and proven reliability. Keep an adapter interface to allow swapping to a custom TCP wrapper in a hardening phase if metrics justify.

## Alternatives
- Custom TCP wrapper now: more control but higher complexity and test surface

## Consequences
- Quicker path to MVP, defers deeper protocol control
- Adapter pattern keeps future options open without large refactors

## Follow-up
- Measure latency variance, backpressure, reconnect behavior in Phase 2/3
- If justified, write ADR to proceed with custom wrapper
