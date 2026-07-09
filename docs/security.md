# Security & Authentication

Volt Rental enforces strict security policies at both the API layer (Spring Security + JWT) and the Database layer (Supabase RLS).

---

## 1. API Security Layer

The backend uses **Spring Security** configured for stateless execution (JWT-based authentication):

- **JWT Filter (`JwtRequestFilter.java`):** Intercepts HTTP requests, reads the `Authorization` header, extracts the bearer token, validates the signature, and sets the Security context.
- **BCrypt Hashing:** All passwords are salted and hashed using BCrypt before storing in the database.
- **Stateless Sessions:** Sessions are not stored in memory on the server side, ensuring horizontal scalability.

### CORS Rules
CORS is explicitly configured to permit safe client connections:
```java
configuration.setAllowedOrigins(List.of("*")); // Open for development; restrict in Prod
configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
```

---

## 2. Secrets Management

Secrets must **never** be committed to the git history. We use Environment Variables for configuration:

| Variable | Scope | Description |
|---|---|---|
| `JWT_SECRET` | Backend | HS256 Signing Key for security validation |
| `SPRING_DATASOURCE_URL` | Backend | Production PostgreSQL JDBC Connection URL |
| `SPRING_DATASOURCE_USERNAME` | Backend | Production Supabase User |
| `SPRING_DATASOURCE_PASSWORD` | Backend | Production Supabase Password |
| `VERCEL_TOKEN` | CI/CD | Token to authorize Vite deployments |

---

## 3. Public vs. Private Resource Rules

- **Allowed Without Authorization:**
  - `POST /login` and `POST /register`
  - `GET /bikes`, `GET /bike/**`, `GET /stations`
  - `GET /actuator/health` (Health Monitoring)
- **Requires JWT Bearer Header:**
  - `POST /rent`
  - `POST /return`
  - `GET /profile`
  - All admin endpoints (`/admin/**`)
