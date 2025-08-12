# Infrastructure Overview (Placeholder)

This directory will host infrastructure-as-code (IaC) and deployment artifacts referenced in the model spec.

Planned structure:
- `terraform/` for cloud resources (VPC, subnets, security groups, EKS/ECS, etc.)
- `kubernetes/` manifests or Helm charts for app deployment
- `argocd/` GitOps configuration
- `monitoring/` Prometheus/Grafana/Alertmanager configs

Until then, use `docker-compose.dev.yml` for local dev services (Redis).
