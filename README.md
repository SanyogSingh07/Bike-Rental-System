# Volt Rental (Bike Rental System)

> Full-stack urban mobility enterprise product featuring a Spring Boot REST API, React 19 web application, Supabase PostgreSQL database, and MkDocs technical documentation.

[Live Application](https://volt-rental-frontend.vercel.app) · [Repository](https://github.com/SanyogSingh07/Bike-Rental-System)

---

## Overview

**Volt Rental** is a full-stack monorepo application engineered for managing urban bike rentals, user accounts, fleet availability, and transaction processing. Built with modern enterprise software patterns, the system couples a high-performance Java Spring Boot backend with a responsive React 19 frontend hosted on Vercel.

---

## Problem & Solution

Traditional bike rental management systems suffer from disconnected inventory states and complex rental workflows. **Volt Rental** solves this by providing:
- Real-time fleet inventory tracking and availability status.
- Transactional rental processing backed by PostgreSQL constraint handling.
- Automated technical documentation built with MkDocs.

---

## System Architecture

```
[ React 19 + TypeScript Frontend ] ── (Vercel)
                  │
                  ▼ (REST APIs)
[ Spring Boot 3.5 Backend Service ]
                  │
                  ▼ (PostgreSQL JPA / Hibernate)
    [ Supabase Managed Database ]
```

---

## Tech Stack & Components

- **Backend**: Java 17, Spring Boot 3.5, Spring Security, Spring Data JPA, Hibernate.
- **Frontend**: React 19, TypeScript, Vite, TailwindCSS, Lucide Icons.
- **Database**: Supabase Cloud PostgreSQL.
- **Documentation & Deployment**: MkDocs, Vercel Cloud Platform.

---

## Project Structure

```
Bike-Rental-System/
├── README.md
├── mkdocs.yml             # MkDocs Configuration
├── backend/               # Spring Boot Monorepo Component
│   ├── pom.xml
│   └── src/main/java/com/volt/rental/
├── frontend/              # React 19 Monorepo Component
│   ├── package.json
│   └── src/
└── docs/                  # System Architecture Documentation
```

---

## Installation & Setup

### Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend (React 19)
```bash
cd frontend
npm install
npm run dev
```
