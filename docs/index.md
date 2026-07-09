# Volt Rental - Welcome

Welcome to the official technical documentation for **Volt Rental**, a premium, full-stack smart bike rental platform engineered for enterprise mobility.

## Project Vision

Volt Rental aims to be a showcase of modern software engineering by combining Clean Architecture, robust automated CI/CD pipelines, production-ready cloud deployments, secure development practices, and exceptional developer experience.

```
       ┌────────────────────────┐
       │      Volt Rental       │
       │    Smart Bike App      │
       └───────────┬────────────┘
                   │ HTTPS / REST
                   ▼
       ┌────────────────────────┐
       │   Spring Boot Backend  │
       │     (Clean Arch)       │
       └───────────┬────────────┘
                   │ JDBC
                   ▼
       ┌────────────────────────┐
       │ Supabase PostgreSQL DB │
       └────────────────────────┘
```

## Platform Core Features

- **Dynamic Pricing Engine:** Tailored pricing based on demand, bike availability, and time.
- **Smart Ride Unlock:** QR code lock/unlock workflow integration.
- **Fleet Analytics:** Real-time metrics on usage, bike conditions, and location.
- **Clean REST APIs:** Fully secure JSON Web Token (JWT) based API layer.
- **Modern React Client:** Fast, state-driven dashboard and user flow.

## Technical Quick Links

- [Engineering Playbook](engineering-playbook.md) — Coding standards, git conventions, and repository rules.
- [Architecture Design](architecture.md) — Clean Architecture layers and system boundaries.
- [API Reference](api.md) — RESTful endpoints, request/response formats.
- [Database Structure](database.md) — Supabase PostgreSQL schema and Row Level Security.
- [Security & Authentication](security.md) — JWT architecture, BCrypt password hashing, and endpoint rules.
- [Deployment Guide](deployment.md) — Monorepo-aware CD pipeline details for Vercel and Railway.
- [Testing Guidelines](testing.md) — Unit testing, integration testing, and smoke test specs.
