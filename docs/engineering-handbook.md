# Volt Rental - Engineering Handbook

> Version: 1.0.0
> Project: Volt Rental - Smart Bike Rental Platform
> Repository Type: Full Stack Monorepo
> Architecture: Enterprise Ready
> Deployment: GitHub + Vercel + Render + Supabase
> Status: Production Roadmap

## Purpose

This document establishes the engineering standards, repository architecture, development workflow, deployment strategy, collaboration guidelines, and coding conventions for Volt Rental.

Every contributor must follow this handbook before making changes to the repository.

The primary objectives are to:

- Maintain a clean and scalable architecture.
- Prevent deployment failures.
- Prevent merge conflicts.
- Ensure every deployment is reproducible.
- Support future contributors.
- Maintain enterprise-grade code quality.
- Keep the repository production ready.

## Repository Overview

```text
Bike-Rental-System/
├── .github/
├── docs/
├── backend/
├── frontend/
├── frontend-react/
├── assets/
├── scripts/
├── README.md
├── LICENSE
├── CHANGELOG.md
├── ROADMAP.md
├── CONTRIBUTING.md
├── SECURITY.md
├── CODE_OF_CONDUCT.md
└── .gitignore
```

## Repository Philosophy

This repository follows:

- Feature-first architecture
- Separation of concerns
- Clean Architecture principles
- SOLID principles
- Reusable components
- Modular development
- Enterprise documentation
- Continuous Integration
- Continuous Deployment

## Current Project Structure

### Backend

```text
backend/
src/
main/
java/
resources/
test/
pom.xml
mvnw
```

Responsibilities:

- Business Logic
- Authentication
- Recommendation Engine
- Booking System
- REST APIs
- Database Communication

### Frontend

```text
frontend/
src/
public/
components/
pages/
layouts/
hooks/
services/
assets/
package.json
vite.config.ts
```

Responsibilities:

- User Interface
- Dashboard
- Booking Flow
- Search
- Checkout
- Authentication
- Responsive Layout

### Frontend React

The React application under frontend-react is the primary modern client experience.

### Legacy Frontend

Contains static HTML, CSS, and JavaScript and is maintained only for migration purposes. No new features should be added here.

### Documentation

All documentation belongs inside docs/.

## Folder Responsibilities

### backend

Contains Spring Boot, REST APIs, security, and business logic.

### frontend

Contains the legacy web experience.

### frontend-react

Contains the React application.

### docs

Contains architecture, deployment, database, roadmap, security, quality standards, and the engineering handbook.

### assets

Contains screenshots, logos, images, GIFs, icons, and videos.

### scripts

Contains automation, migration, database setup, and deployment scripts.

## Backend Package Structure

```text
controller/
service/
repository/
model/
security/
config/
dto/
mapper/
exception/
utils/
bootstrap/
```

Each package has a single responsibility.

## Frontend Structure

```text
pages/
components/
layouts/
hooks/
services/
context/
types/
utils/
styles/
assets/
```

Never place business logic inside UI components.

## Coding Standards

### Java

- Follow Spring Boot conventions.
- Constructor injection only.
- No field injection.
- Use DTOs.
- Use services.
- Repository only accesses the database.

### React

- Functional components only.
- TypeScript strict mode.
- Reusable components.
- Custom hooks.

### CSS

- Tailwind preferred.
- No duplicated styles.

## Naming Conventions

### Classes

```text
BikeController
RentalService
UserRepository
```

### Interfaces

```text
BikeService
UserRepository
```

### React

```text
BikeCard.tsx
BookingForm.tsx
Checkout.tsx
```

### Hooks

```text
useAuth()
useBooking()
useSearch()
```

## Git Strategy

```text
main
develop
feature/*
fix/*
hotfix/*
release/*
```

Never push directly to main.

## Commit Convention

```text
feat:
fix:
docs:
style:
refactor:
test:
build:
ci:
perf:
chore:
```

Examples:

```text
feat: add bike recommendation engine
fix: resolve checkout validation bug
docs: update deployment guide
```

## Pull Requests

Every PR requires:

- Description
- Issue Link
- Screenshots
- Test Results
- Reviewer Approval

No self-merging.

## Repository Cleanup Rules

Never commit:

```text
target/
node_modules/
dist/
build/
coverage/
.env
logs/
```

Always ignore generated files.

## Documentation Standards

Every major feature must include:

- Purpose
- Architecture
- Flow
- Screenshots
- API
- Future Scope

## Security Standards

Never commit secrets, API keys, database passwords, or tokens.

Use .env.example.

## Environment Variables

### Backend

```text
DATABASE_URL
SUPABASE_URL
SUPABASE_KEY
JWT_SECRET
PORT
```

### Frontend

```text
VITE_API_URL
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

## Deployment Architecture

```text
GitHub
↓
GitHub Actions
↓
Vercel
↓
Render
↓
Supabase
```

## GitHub Standards

The repository must include README, LICENSE, CHANGELOG, ROADMAP, SECURITY, CONTRIBUTING, and CODE_OF_CONDUCT.

## GitHub Actions

Every push triggers:

- Lint
- Type Check
- Tests
- Build
- Deploy Preview
- Health Check
- Production

## Branch Protection

Enable:

- Required Reviews
- Required Status Checks
- No Force Push
- No Branch Deletion

## Issue Templates

Create templates for:

- Bug Report
- Feature Request
- Documentation
- Question
- Enhancement

## Pull Request Template

Include:

- Problem
- Solution
- Testing
- Screenshots
- Checklist

## Performance Standards

### Desktop

- Lighthouse Performance: 95+
- Accessibility: 95+
- SEO: 95+
- Best Practices: 95+

## Code Quality

Must pass:

- ESLint
- Prettier
- TypeScript
- Spring Validation
- No warnings

## Testing

Required:

- Unit Tests
- Integration Tests
- API Tests
- Smoke Tests
- Regression Tests

## Documentation Before Release

Verify README, API docs, architecture docs, deployment docs, database docs, roadmap, screenshots, and changelog.

## Repository Health Checklist

The repository should always have:

- Clean folder structure
- Working build
- Passing tests
- Working deployment
- No merge conflicts
- Updated documentation
- No unused files
- No unnecessary dependencies

## Future Expansion

The repository should support:

- AI Recommendation System
- IoT Smart Locks
- QR Unlock
- Ride Analytics
- Mobile Application
- Admin Portal
- Vendor Dashboard
- Fleet Management
- Microservices
- Containerization
- Kubernetes

## Definition of Done

A task is complete only if:

- Code reviewed
- Tests passed
- Documentation updated
- Build successful
- Deployment verified
- Responsive verified
- Accessibility verified
- Performance verified
- Security verified
- Approved by reviewer

Only then may it be merged into main.

## Repository Goal

Volt Rental should represent a production-grade engineering project that demonstrates clean architecture, enterprise development practices, modern full-stack engineering, secure deployment, scalable infrastructure, high code quality, excellent documentation, recruiter-friendly repository design, open source readiness, and long-term maintainability.
