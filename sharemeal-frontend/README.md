# ShareMeal Frontend

React 18 + TypeScript + Vite + Material UI (v6) frontend for the ShareMeal
food-donation platform, built against the **actual** Spring Boot microservices
in this repo (auth-service, food-service, claim-service, notification-service,
api-gateway, eureka-server, config-server) rather than the original spec doc.

## Running it

```bash
npm install
npm run dev
```

The app expects the API Gateway at `http://localhost:8080` (see `.env` /
`VITE_API_BASE_URL`). Start Eureka, the config server, and all four business
services before logging in — `getProfile()` runs right after login and will
fail if `auth-service` isn't reachable.

## Important: this diverges from the original spec document

The spec document described endpoints like `POST /food/add`, `POST /claim`,
and a login response containing `{ token, email, role }`. The **real** backend
code in this repo is different, and the frontend was built to match the real
code:

| Area | Spec doc said | Actual backend |
|---|---|---|
| Gateway routes | `/food/**`, `/claim/**` | `/foods/**`, `/claims/**` (see `api-gateway/application.yml`) |
| Login response | `{ token, email, role }` | `{ token, message }` only — no email/role |
| Register | `email`, `password`, `role` | also requires `fullName` (letters/spaces, 3–100 chars) and a password matching `8-20 chars, ≥1 digit, ≥1 special character` |
| Add food fields | `foodName, quantity, location, expiryTime, donorEmail` | `foodName, quantity, description, originalPrice, discountedPrice` — no `location`/`expiryTime`, and `donorEmail` isn't part of the request body at all |
| Claim food | `POST /claim { foodId, claimerEmail }` | `POST /claims { foodId, claimerEmail }` (note the `s`) |
| Notifications | `GET /notifications` | also `GET /notifications/user/{email}` and `PUT /notifications/read/{id}`, which the UI uses |

### How login works here

`POST /auth/login` only returns a JWT and a message — it does **not** return
the user's role or profile info. So `AuthContext.login()`:

1. Calls `/auth/login` and stores the token.
2. Immediately calls `GET /auth/profile` (now authorized via the stored
   token) to fetch `id`, `fullName`, `email`, `role`.
3. Persists the merged user object to `localStorage` under `shareMealUser`,
   with the token under `shareMealToken`.

### A backend quirk worth knowing about

`FoodController.addFood()` currently hardcodes the donor email
(`"harh@gmail.com"`) instead of reading it from the authenticated user, and
`FoodRequestDTO` has no `donorEmail` field at all. This means **every food
donation added through the API today is attributed to that hardcoded email**,
regardless of who's logged in on the frontend. This is a backend limitation,
not something the frontend can work around — worth fixing server-side
(e.g. reading the email from the JWT/Authentication) before this goes further.

### Auth enforcement

Only `auth-service` currently enforces JWT auth (`/auth/profile`,
`/auth/users/**`, etc.). `food-service`, `claim-service`, and
`notification-service` have no Spring Security config at all, so their
endpoints are open regardless of the token. The frontend still attaches the
JWT to every request via an Axios interceptor so this keeps working once
those services add their own auth.

## Project structure

```
src/
  components/   Navbar, Footer, FoodCard, ProtectedRoute, Loader
  pages/        HomePage, LoginPage, RegisterPage, DonorDashboard,
                NgoDashboard, FoodListPage, AddFoodPage, NotificationPage,
                NotFoundPage (+ one CSS file per page)
  services/     api.ts (axios instance/interceptors), authService,
                foodService, claimService, notificationService
  contexts/     AuthContext.tsx
  types/        index.ts — TS interfaces mirroring the real backend DTOs
  theme.ts      MUI theme (palette, typography, component overrides)
```

## Roles

The `Role` enum in `auth-service` actually includes `ADMIN`, `DONOR`, `NGO`,
`CUSTOMER`, and `VOLUNTEER`, but this product only on-boards **DONOR** and
**NGO** users, so the register form and route guards only expose those two.
