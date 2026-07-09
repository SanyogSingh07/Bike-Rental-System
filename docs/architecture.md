# Architecture Design

Volt Rental is built using a decoupled **Clean Architecture** style, separating the Presentation (Frontend Client) from the Core Business Rules and Data Access (Backend API).

```
 ┌──────────────────────┐
 │    React Client      │ (Presentation)
 └──────────┬───────────┘
            │ HTTPS (JSON REST API)
            ▼
 ┌──────────────────────┐
 │   REST Controller    │
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │    Service Layer     │ (Core Domain & Business Logic)
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │   Spring Data JPA    │ (Data Access Abstraction)
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │ Supabase PostgreSQL  │ (External Database)
 └──────────────────────┘
```

## Backend Architectural Layers

The Spring Boot backend is divided into four distinct layers:

1. **Controller Layer (`com.example.demo.controller`):**
   - Handles incoming HTTP requests.
   - Converts HTTP payloads to Java Objects (DTOs) and validates fields.
   - Delegate actions to the Service layer and returns standardized JSON responses.
   - Example files: [AdminController.java](file:///c:/Users/sanyo/OneDrive/Desktop/Bike%20Rental%20System/backend/src/main/java/com/example/demo/controller/AdminController.java), `BikeController.java`.

2. **Service Layer (`com.example.demo.service`):**
   - Houses the core business algorithms (e.g., bike availability checks, recommendation rules).
   - Coordinates transactional operations.
   - Example files: [RentalService.java](file:///c:/Users/sanyo/OneDrive/Desktop/Bike%20Rental%20System/backend/src/main/java/com/example/demo/service/RentalService.java), `BikeRecommendationService.java`.

3. **Repository Layer (`com.example.demo.repository`):**
   - Abstract database operations using Spring Data JPA.
   - Interacts with PostgreSQL/Supabase database tables.
   - Example files: `BikeRepository.java`, `UserRepository.java`.

4. **Model Layer (`com.example.demo.model`):**
   - Represents ORM mapped entities corresponding to database tables.
   - Example files: `Bike.java`, `Rental.java`, `User.java`.

## Frontend Client Architecture

The React client in `frontend-react/` uses a state-driven modern layout:

- **State Management:** Uses **Zustand** (`src/store/authStore.ts`) for modular global state (e.g. auth status, active rental tracking) without boilerplate.
- **Service Layer:** API requests are centralized in `src/services/api.ts` utilizing Axios. Direct fetching inside components is strictly forbidden.
- **TypeScript Core:** Unified definitions reside in `src/types/index.ts`.
