# API Specifications

Volt Rental exposes a RESTful JSON API. All endpoints are prefix-free (e.g., direct root resources) and use standard HTTP methods.

---

## Authentication Endpoints

### Register a User
- **URL:** `/register`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "username": "johndoe",
    "password": "securepassword",
    "email": "john@example.com",
    "role": "USER"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "User registered successfully"
  }
  ```

### Login
- **URL:** `/login`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "username": "johndoe",
    "password": "securepassword"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiJ9..."
  }
  ```

---

## Bike & Station Endpoints

### List All Bikes
- **URL:** `/bikes`
- **Method:** `GET`
- **Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "name": "Ather 450X",
      "type": "ELECTRIC",
      "status": "AVAILABLE",
      "batteryLevel": 85,
      "pricePerHour": 50.0,
      "stationId": 2
    }
  ]
  ```

### Get Bike Details
- **URL:** `/bike/{id}`
- **Method:** `GET`
- **Response (200 OK):**
  ```json
  {
    "id": 1,
    "name": "Ather 450X",
    "type": "ELECTRIC",
    "status": "AVAILABLE",
    "batteryLevel": 85,
    "pricePerHour": 50.0
  }
  ```

### List All Stations
- **URL:** `/stations`
- **Method:** `GET`
- **Response (200 OK):**
  ```json
  [
    {
      "id": 2,
      "name": "Indiranagar Metro Station",
      "latitude": 12.9718,
      "longitude": 77.6412,
      "capacity": 15
    }
  ]
  ```

---

## Rental & Management Endpoints (JWT Secured)

### Start a Rental
- **URL:** `/rent`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "bikeId": 1
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "id": 10,
    "userId": 5,
    "bikeId": 1,
    "startTime": "2026-07-09T21:42:00Z",
    "status": "ACTIVE"
  }
  ```

### End a Rental
- **URL:** `/return`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "rentalId": 10,
    "stationId": 3
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "id": 10,
    "status": "COMPLETED",
    "cost": 150.0,
    "endTime": "2026-07-09T23:42:00Z"
  }
  ```
