# Volt Rental — Engineering Playbook

> **Version:** 2.0.0
> **Project:** Volt Rental - Premium Smart Bike Rental Platform
> **Repository Type:** Enterprise Full-Stack Monorepo
> **Documentation Standard:** Production Grade
> **Status:** Active Development
> **Maintainers:** Volt Rental Engineering Team

---

## Engineering Philosophy

Volt Rental is engineered as if it were a production SaaS product. Every design decision prioritizes scalability, security, maintainability, performance, readability, developer experience, and future expansion.

---

## Repository Architecture

```
Bike-Rental-System/
├── .github/
│   ├── workflows/             # CI/CD Workflows
│   ├── ISSUE_TEMPLATE/       # GitHub Issue Templates
│   └── PULL_REQUEST_TEMPLATE.md
├── backend/                  # Spring Boot REST API
├── frontend-react/           # Vite + React + TypeScript App
├── frontend/                 # Legacy (Static HTML, DO NOT DEPLOY)
├── docs/                     # Documentation (GitHub Pages)
├── assets/                   # Screenshots & Assets
└── scripts/                  # Automation scripts
```

---

## Coding Standards

### Backend (Spring Boot)
- **Controller Layer:** Exposes endpoints. No business logic allowed.
- **Service Layer:** Houses core business rules, transactional logic, and validation.
- **Repository Layer:** Interacts with the database via JPA.
- **Dependency Injection:** Constructor injection only. Do not use field-level `@Autowired` injection.

### Frontend (React + TypeScript)
- **Functional Components:** Avoid class components.
- **Type Safety:** Maintain strict TypeScript compliance (no `any` type).
- **Separation of Concerns:** Never make API requests directly inside UI components. Extract logic to hooks or service files.

---

## Git & Collaboration Flow

### Branch Naming Conventions
- `main` — Production branch (Protected).
- `develop` — Integration branch (Protected).
- `feature/*` — For new features.
- `fix/*` — For bug fixes.
- `release/*` — For deployment preparation.

### Commit Guidelines
We use semantic commit messages:
- `feat:` for new features (e.g., `feat: implement QR bike unlock`).
- `fix:` for bug fixes (e.g., `fix: resolve checkout validation issue`).
- `docs:` for documentation modifications.
- `refactor:` for code changes that neither fix a bug nor add a feature.
- `chore:` for updating build files, configs, etc.

---

## Definition of Done (DoD)

A task is considered complete only if it meets the following criteria:
1. **Implementation:** Code compiled with zero errors.
2. **Review:** Pull Request approved by at least one reviewer.
3. **CI/CD:** Automated tests and builds pass.
4. **Docs:** Documentation updated on GitHub Pages.
5. **Security:** No secrets or private credentials exposed.
6. **Responsive:** Frontend layouts verified on mobile & desktop screens.
