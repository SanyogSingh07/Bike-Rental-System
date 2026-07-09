# Deployment Guide

Volt Rental uses a fully automated CI/CD pipeline triggered by GitHub Actions to deploy to three distinct environments.

---

## 1. Frontend (Vercel)

The React application inside `frontend-react/` is deployed to Vercel.

### Vercel Dashboard Settings (Monorepo Configuration)

Since the repository is a monorepo, you must configure the following settings in your Vercel Project Settings (General tab or during import):

- **Root Directory:** `frontend-react` (Ensure the option *"In a monorepo, use this directory to isolate your project's build and development configuration"* is enabled).
- **Framework Preset:** `Vite` (Vercel should automatically detect this once the root directory is set).

- **Deploy Branch:** `main`
- **Output Directory:** `dist/`
- **Build Command:** `npm run build`
- **Configuration File:** [vercel.json](file:///c:/Users/sanyo/OneDrive/Desktop/Bike%20Rental%20System/frontend-react/vercel.json)

---

## 2. Backend (Railway)

The Spring Boot backend inside `backend/` is deployed to Railway.

- **Deployment Method:** Railway CLI execution in the GitHub Actions pipeline.
- **Workflow Steps:** 
  1. Installs the Railway CLI.
  2. Runs `railway up --service <service-id> --ci` inside the `backend` directory.
- **Port Binding:** The application binds to the dynamic port assigned by Railway at runtime (`server.port=${PORT:8080}`).
- **Database Connection:** Connects to Supabase PostgreSQL database using environment variable overrides.

---

## 3. Documentation (GitHub Pages)

The documentation site in `docs/` is automatically compiled and hosted using GitHub Pages.

- **Tool:** **MkDocs** (Material Theme)
- **Deployment Action:** `mkdocs gh-deploy` automatically executed on push to the `main` branch.

---

## 4. Environment Variables Checklist

Make sure the following variables are set in the GitHub repository secrets:

- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- `RAILWAY_TOKEN`, `RAILWAY_SERVICE_ID`, `RAILWAY_HEALTH_URL`
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
