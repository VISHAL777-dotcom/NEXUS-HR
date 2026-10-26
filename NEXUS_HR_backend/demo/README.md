# NEXUS HR — Backend API

Spring Boot 3 / Java 17 backend for the NEXUS HR Operating System, implementing the schema
defined in `NEXUS_HR_Database_Specification.pdf` (10 tables: Roles, Users, Departments,
Attendance, Leave_Requests, Leave_Balances, Payroll, Candidates, Performance_Reviews, Audit_Logs).

## Setup

1. Create the MySQL database:
   ```sql
   CREATE DATABASE nexus_hr_db;
   ```
2. Update `src/main/resources/application.properties` with your MySQL username/password.
3. Run:
   ```
   ./mvnw spring-boot:run
   ```
   Hibernate will auto-create all tables on first run (`ddl-auto=update`).
4. Seed at least one row in `roles` (e.g. Admin, HR Manager, Employee) before registering users,
   since every user requires a `role_id`.

## Authentication

- `POST /api/auth/register` — create a user (public, for initial admin setup / self-service).
- `POST /api/auth/login` — returns a JWT bearer token. Send it as `Authorization: Bearer <token>`
  on all subsequent requests.

## Modules & Endpoints

| Module | Base Path | Notes |
|---|---|---|
| Roles | `/api/roles` | Admin/HR Manager only |
| Departments | `/api/departments` | |
| Users | `/api/users` | |
| Attendance | `/api/attendance` | `/user/{id}/clock-in`, `/user/{id}/clock-out` |
| Leave Requests | `/api/leave-requests` | `/{id}/approve`, `/{id}/reject` |
| Leave Balances | `/api/leave-balances` | `/user/{id}/year/{year}` |
| Payroll | `/api/payroll` | Admin/HR Manager/Finance only |
| Candidates | `/api/candidates` | public read for the recruitment kanban demo |
| Performance Reviews | `/api/performance-reviews` | `/{id}/finalize` |
| Audit Logs | `/api/audit-logs` | Admin/HR Manager only, read-only |

## Security

- Stateless JWT auth (`security/JwtUtil`, `security/JwtAuthFilter`).
- Role-based access rules live in `config/SecurityConfig`.
- Passwords are hashed with BCrypt before being persisted.

## Layers

```
Model        -> JPA @Entity classes (one per table)
repository   -> Spring Data JPA interfaces
service      -> business logic, validation, orchestration
controller   -> REST endpoints (thin, delegate to service)
dto          -> request/response payloads that don't map 1:1 to an entity
security     -> JWT + Spring Security wiring
config       -> SecurityConfig, CorsConfig
exception    -> custom exceptions + @RestControllerAdvice global handler
```
