# Testing Strategy

Volt Rental enforces automated quality gates in the CI/CD pipeline using JUnit for the backend and Oxlint/TypeScript checks for the frontend.

---

## 1. Backend Testing

The Spring Boot backend uses JUnit 5 and Mockito for testing.

- **Tests Location:** `backend/src/test/java/`
- **Execution Command:**
  ```bash
  cd backend
  ./mvnw test
  ```

### Key Test Categories
- **Unit Tests:** Verify individual business rules (e.g., pricing calculations in `RentalService` and recommendations in `BikeRecommendationService`).
- **Integration Tests:** Verify full controller and service paths utilizing the H2 in-memory database to simulate database writes/reads without affecting Supabase.
- **Controller Tests:** Verify Spring Security configurations and endpoints access parameters.

---

## 2. Frontend Validation

The React frontend uses linting and type-checking to prevent build breakages.

- **Oxlint (`npm run lint`):** Performs extremely fast syntax and code style checks.
- **TypeScript Compiler (`tsc -b`):** Runs type checks across the client code during the build.
- **Vite Build (`npm run build`):** Verifies that the production bundles can be successfully packaged without warnings.
- **Execution Command:**
  ```bash
  cd frontend-react
  npm run lint
  npm run build
  ```
