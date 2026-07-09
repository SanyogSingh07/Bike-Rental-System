# Deployment Guide

Volt Rental uses a fully automated CI/CD pipeline triggered by GitHub Actions to deploy to three distinct environments.

---

## 1. Frontend (Vercel)

The React application inside `frontend-react/` is deployed to Vercel.

- **Deploy Branch:** `main`
- **Output Directory:** `dist/`
- **Build Command:** `npm run build`
- **Configuration File:** `vercel.json`

---

## 2. Backend (Render)

The Spring Boot backend inside `backend/` is deployed to Render.

- **Trigger:** Render watch repository deployment hook triggered via HTTP POST request in the CD pipeline.
- **Environment Variables:** Must be set in Render's dashboard (JWT Secret, Database Credentials).
- **Run Command:** `java -jar target/*.jar`

---

## 3. Documentation (GitHub Pages)

The documentation site in `docs/` is automatically compiled and hosted using GitHub Pages.

- **Tool:** **MkDocs** (Material Theme)
- **Deployment Action:** `mkdocs gh-deploy` automatically executed on push to the `main` branch.

---

## 4. Environment Variables Checklist
Make sure the following variables are set in the GitHub repository secrets:
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- `RENDER_API_KEY`, `RENDER_SERVICE_ID`
- `RENDER_HEALTH_URL` (the backend base URL on Render, e.g., `https://volt-backend.onrender.com`)
- `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`
