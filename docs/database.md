# Database Design

Volt Rental uses **Supabase PostgreSQL** as its production relational database. 

## Entity-Relationship Model

```
       ┌───────────────┐
       │     USERS     │
       └───────┬───────┘
               │ 1
               │
               │ *
       ┌───────▼───────┐             ┌───────────────┐
       │    RENTALS    │             │   STATIONS    │
       └───────▲───────┘             └───────┬───────┘
               │ *                           │ 1
               │                             │
               │ 1                           │ *
       ┌───────┴───────┐             ┌───────▼───────┐
       │     BIKES     ◄─────────────┤  BIKE_STATION │ (Relation mapping)
       └───────────────┘             └───────────────┘
```

---

## Table Schemas

### 1. `users`
Represents customer and admin credentials.
- `id` (UUID or BIGINT, Primary Key)
- `username` (VARCHAR, Unique, Not Null)
- `email` (VARCHAR, Unique, Not Null)
- `password` (VARCHAR, Encrypted, Not Null)
- `role` (VARCHAR, e.g., 'USER', 'ADMIN')

### 2. `bikes`
Represents rental fleet inventory.
- `id` (BIGINT, Primary Key)
- `name` (VARCHAR, Not Null)
- `type` (VARCHAR, e.g., 'ELECTRIC', 'GEARED', 'GEARLESS')
- `status` (VARCHAR, e.g., 'AVAILABLE', 'RENTED', 'MAINTENANCE')
- `battery_level` (INT)
- `price_per_hour` (DECIMAL, Not Null)

### 3. `stations`
Represents geographical hubs where bikes are located or returned.
- `id` (BIGINT, Primary Key)
- `name` (VARCHAR, Not Null)
- `latitude` (DOUBLE, Not Null)
- `longitude` (DOUBLE, Not Null)
- `capacity` (INT)

### 4. `rentals`
Tracks transaction and ride logs.
- `id` (BIGINT, Primary Key)
- `user_id` (BIGINT, Foreign Key referencing `users(id)`)
- `bike_id` (BIGINT, Foreign Key referencing `bikes(id)`)
- `start_time` (TIMESTAMP)
- `end_time` (TIMESTAMP, Nullable)
- `cost` (DECIMAL, Nullable)
- `status` (VARCHAR, e.g., 'ACTIVE', 'COMPLETED')

---

## Row Level Security (RLS)
Supabase applies strict PostgreSQL policies:
- **Public Read:** `bikes` and `stations` can be queried by public non-authenticated requests.
- **Restricted Read/Write:** `rentals` and user specific tables are secured by token rules where users can only query/edit their own rows:
  ```sql
  CREATE POLICY "Users can query their own rentals"
    ON rentals FOR SELECT
    USING (auth.uid() = user_id);
  ```
