# Enterprise Deployment & Security Hardening Guide (ELUSoC 2026)

This document provides production hardening guidelines for deploying SnapPass AI across Kubernetes, Docker Swarm, and cloud infrastructure.

## 1. Network & TLS Hardening
- Enforce TLS 1.3 across all ingress routers.
- Set strict Content Security Policies (CSP) preventing inline script execution.
- Implement rate limiting at API Gateway (Kong / Nginx Ingress).

## 2. Container Security
- Run container images with non-root UID 10001.
- Mount root filesystems as read-only (`readOnlyRootFilesystem: true`).
- Use multi-stage Docker builds to keep images minimal and free of dev tooling.

## 3. Secret Management
- Store JWT secrets and database credentials in HashiCorp Vault or AWS Secrets Manager.
- Never inject raw environment variables into static configuration files.
