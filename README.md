# Volt Rental

### Enterprise-Grade Smart Bike Rental Platform

Volt Rental is a production-ready, full-stack monorepo designed for premium micro-mobility operations. Built on a Clean Architecture, it leverages Spring Boot, React, Vite, TailwindCSS, and Supabase to deliver a high-performance, secure, and fully automated bike sharing ecosystem.

---

## 🚀 Live Links & Documentation

- **Interactive Documentation Website:** [Volt Rental Documentation Portal](https://SanyogSingh07.github.io/Bike-Rental-System/) (Built with MkDocs Material Theme)
- **Production API:** `https://volt-rental-backend.up.railway.app` (Hosted on Railway)
- **Production Web Application:** `https://volt-rental-frontend.vercel.app` (Hosted on Vercel)

---

## 🛠 Technology Stack

### Frontend Client (`frontend-react/`)
- **Core:** React 19, TypeScript
- **Styling:** TailwindCSS 4
- **State Management:** Zustand
- **Bundler:** Vite

### Backend API Services (`backend/`)
- **Core:** Spring Boot 3.5.0, Java 21
- **Database Access:** Spring Data JPA
- **Security:** Spring Security (Stateless HS256 JWT, BCrypt Salting)
- **Build System:** Maven

### Database & Operations
- **Database:** Supabase (PostgreSQL 15) with Row-Level Security (RLS)
- **CI/CD Automation:** GitHub Actions
- **Monitoring:** Spring Boot Actuator

---

## 🏛 Clean Architecture Overview

Volt Rental splits the application concerns into decoupled boundaries:

```
  ┌───────────────────────┐
  │     Vite + React      │ ──► Presentation Client
  └──────────┬────────────┘
             │ HTTP REST / JWT
             ▼
  ┌───────────────────────┐
  │  Spring Boot Backend  │
  │   ├── Controller      │ ──► REST request mapping & DTO validation
  │   ├── Service         │ ──► Core domain business logic
  │   └── Repository      │ ──► Abstract data access
  └──────────┬────────────┘
             │ JDBC
             ▼
  ┌───────────────────────┐
  │  Supabase PostgreSQL  │ ──► Relational Data Store
  └───────────────────────┘
```

---

## 📦 Monorepo Directory Layout

```
Volt-Rental/
├── .github/workflows/    # Monorepo-aware CI/CD pipelines
├── backend/              # Spring Boot backend maven project
├── frontend-react/       # Vite + React client codebase
├── frontend/             # Legacy static HTML/CSS (DO NOT DEPLOY)
├── docs/                 # Documentation Markdown files (GitHub Pages)
├── assets/               # Screenshots, diagrams, and repository media
└── scripts/              # Helper shell and deployment automation scripts
```

---

## ⚙️ Quick Start Installation

### Prerequisites
- Node.js 22 LTS
- Java Development Kit (JDK) 21
- Maven (or use `./mvnw` wrapper)

### Setup the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run compilation and test validation:
   ```bash
   ./mvnw clean verify
   ```
3. Boot up the local server (listens on port `8080` by default):
   ```bash
   ./mvnw spring-boot:run
   ```

### Setup the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend-react
   ```
2. Install npm dependencies:
   ```bash
   npm ci
   ```
3. Boot the local development server (with Hot Module Replacement):
   ```bash
   npm run dev
   ```

---

## 🚀 Automated CI/CD Pipelines

Our integration pipelines run continuously via GitHub Actions:
- **Quality Gates (`ci.yml`):** Automatically triggers on pull requests and pushes to `develop`/`feature/*` branches. Performs frontend lint checks (`oxlint`), type checks, production builds, and runs JUnit test packages.
- **Deploys (`deploy.yml`):** Triggers on merges to `main`. Deploys the React app to Vercel, deploys the Spring Boot app to Railway, pushes the compiled documentation site to GitHub Pages, and polls the `/actuator/health` endpoint to verify full end-to-end functionality.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
