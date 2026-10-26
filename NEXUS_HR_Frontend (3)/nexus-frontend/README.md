# NEXUS HR — Frontend

React (Vite) frontend for the NEXUS HR Operating System, built to the same design
system as the interactive prototype (Fraunces + Inter + JetBrains Mono, the Ring
motif, floating sidebar, bento dashboard) and wired directly to the Spring Boot
backend from `NEXUS_HR_Backend.zip`.

## Setup

```bash
npm install
cp .env.example .env      # point VITE_API_BASE_URL at your backend if not localhost:8080
npm run dev                # http://localhost:5173
```

Make sure the backend is running on `http://localhost:8080` first (or update `.env`
and `vite.config.js`'s proxy target). Seed at least one row in the backend's
`roles` table first (e.g. `INSERT INTO roles (role_name, description) VALUES
('Admin', 'Full access');`) — every registration needs a role to attach to, and
the `/register` page reads the live role list from `GET /api/roles` to populate
its dropdown.

**Important backend requirement:** this frontend's `/register` page calls
`GET /api/roles` while logged out (to show the role dropdown), so your backend's
`SecurityConfig` must allow that route publicly for `GET` only. If you're using
the `NEXUS_HR_Backend.zip` from before this change, replace
`config/SecurityConfig.java` with the patched version included alongside this
frontend zip — it adds one line:
```java
.requestMatchers(HttpMethod.GET, "/api/roles/**").permitAll()
```
placed *before* the existing `.requestMatchers("/api/roles/**").hasAnyRole(...)`
line, and keeps `POST`/`PUT`/`DELETE` on roles admin-only.

Once that's in place, go to `/register`, fill in the form, and you'll be logged
in automatically right after account creation.

## Structure

```
src/
  api/            one file per backend controller (roleApi, userApi, attendanceApi, ...)
  context/        AuthContext — holds the JWT + current user
  hooks/          useAuth
  routes/         ProtectedRoute (redirects to /login if not authenticated)
  components/
    layout/       Sidebar, Topbar, AppShell
    common/       Ring, Card, Avatar, LoadingSpinner, EmptyState, Toast
    ai/           AIAssistant (floating panel)
    command/      CommandPalette (⌘K)
  pages/          Login, Dashboard, Directory, Profile, Attendance, Payroll,
                  Leave, Recruitment, Organization, Analytics, NotFound
  styles/         tokens.css (design tokens) + global.css (component styles)
```

## Notes

- Every `api/*.js` file's function names and paths map 1:1 to the corresponding
  `*Controller.java` in the backend — if you rename an endpoint there, update the
  matching function here.
- The JWT is stored in `localStorage` under `nexus_token`; `axiosClient` attaches
  it to every request and forces a re-login on a 401.
- Dashboard/Analytics/Organization compute their summaries client-side from the
  existing list endpoints (no dedicated `/dashboard` or `/analytics` endpoint
  exists on the backend) — if you add one later, swap the `Promise.all` calls in
  those pages for the new endpoint.
