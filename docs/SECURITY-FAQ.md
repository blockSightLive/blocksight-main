# Security FAQ

## Do you store secrets in the repository?
No. We never commit secrets. We use `.env.example` files for placeholders and secret managers for real credentials (staging/production).

## How do you validate Bitcoin data accuracy?
We design for parity vs Bitcoin Core RPC on targeted flows and monitor divergence. See the model spec for parity signals.

## What about dependency risk?
We plan SBOM generation and license scans in CI (see automation playbook). Keep dependencies current and avoid unnecessary additions.
