# Lumina — Smart City Safety Mapper

A full-stack web application that allows citizens to discover, report, and track safety incidents in their city in real time. Built with React on the frontend and Spring Boot on the backend, with Ola Maps for geospatial visualization.

---

## Tech Stack

### Frontend
- React 18 (Vite)
- React Router DOM
- Ola Maps Web SDK
- Bootstrap 5
- Axios
- Sonner (toast notifications)
- @react-oauth/google

### Backend
- Spring Boot 3
- Spring Security + JWT
- Spring Data JPA
- Spring AOP
- MapStruct
- Lombok
- Google API Client (ID token verification)
- MySQL

---

## Features Implemented

### Authentication
- Google OAuth2 login via frontend-driven Pattern B (ID token sent to backend for verification)
- JWT issued by backend after Google token verification
- JWT stored in localStorage, attached to all requests via Axios interceptor
- Protected routes — unauthenticated users redirected to login
- Role-based access — USER and ADMIN roles enforced on both backend (@PreAuthorize) and frontend (AdminRoute)
- Automatic session restore on page refresh via localStorage
- Logout clears session and redirects to login

### Map
- Ola Maps Web SDK integration with vector tiles
- Browser Geolocation API — map flies to user's current location on load
- Incident markers rendered as colored dots (color based on incident category)
- Custom HTML popup on marker click — shows title, category, reporter, time ago, distance, upvote button, view details link
- Category filter panel — toggle visibility of incident types
- Radius slider (1–20km) with 500ms debounce — re-fetches incidents on change
- Nearby incidents sidebar — sorted by distance, click to pan map and open popup
- Marker management via Map (keyed by incidentId) for efficient add/remove

### Incidents
- View all incidents near user location within a configurable radius
- Haversine formula — two-step geo query (bounding box pre-filter + precise distance calculation)
- Incident detail page (/incidents/:id) — full info, photo gallery, mini map, reporter card, upvote toggle
- Optimistic upvote — count updates instantly, reverts on failure
- userHasVoted — backend checks vote status per user on detail page load
- Report incident form — category, title, description, date/time, lat/lng, photo upload (max 3)
- "Use my current location" button auto-fills coordinates
- Photo upload via multipart/form-data — stored on filesystem, served as static resources
- Photo preview with individual remove before submit

### User Dashboard (/profile)
- Displays user avatar (Google), name, email, role badge
- Stats cards — total reports, total upvotes received, resolved count
- "My Reports" list with status badges and time ago
- Delete own incidents (ownership-checked endpoint, ADMIN endpoint separate)
- Logout button

### Admin Panel (/admin)
- Paginated table of all incidents (10 per page)
- Stats bar — total, active, resolved, flagged counts
- Inline status change via dropdown per row (ACTIVE / RESOLVED / FLAGGED)
- Delete incident with confirmation dialog
- Client-side search by title
- Status filter dropdown
- Pagination controls with previous/next and page numbers
- Admin-only access enforced on both frontend (AdminRoute) and backend (@PreAuthorize("hasRole('ADMIN')"))

### Navigation
- Persistent navbar on all protected pages (absent on login)
- Active link highlighting via NavLink
- Admin link conditionally rendered for ADMIN role only
- Avatar dropdown — My Profile + Logout
- Bootstrap mobile hamburger collapse
- 404 Not Found page for unmatched routes

---

## Project Structure

```
Backend/
├── controller/
│   ├── AuthController.java
│   ├── IncidentController.java
│   ├── UserController.java
│   └── AdminController.java
├── service/
│   ├── GoogleAuthService.java
│   ├── IncidentService.java
│   ├── IncidentPhotoService.java
│   ├── UserService.java
│   ├── AdminService.java
│   └── FileStorageService.java
├── model/
│   ├── User.java
│   ├── Incident.java
│   ├── IncidentCategory.java
│   ├── IncidentPhoto.java
│   └── IncidentVote.java
├── dto/
│   ├── AuthResponseDto.java
│   ├── GoogleAuthRequestDto.java
│   ├── IncidentDto.java
│   ├── IncidentRequestDto.java
│   ├── IncidentCategoryDto.java
│   ├── UserDto.java
│   ├── UserSummaryDto.java
│   ├── VoteResponseDto.java
│   └── StatusUpdateDto.java
├── mapper/
│   ├── IncidentMapper.java
│   ├── IncidentCategoryMapper.java
│   └── UserMapper.java
├── repo/
│   ├── UserRepo.java
│   ├── IncidentRepo.java
│   ├── IncidentCategoryRepo.java
│   ├── IncidentPhotoRepo.java
│   └── IncidentVoteRepo.java
├── security/
│   ├── JwtUtil.java
│   ├── JwtAuthFilter.java
│   ├── SecurityConfig.java
│   └── GoogleAuthConfig.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── GoogleAuthException.java
│   ├── BadCredentialsException.java
│   └── IncidentNotFoundException.java
└── config/
    └── WebConfig.java

Frontend/
├── api/
│   └── axiosInstance.js
├── components/
│   ├── LoginPage.jsx
│   ├── MapPage.jsx
│   ├── ReportPage.jsx
│   ├── IncidentDetailPage.jsx
│   ├── UserProfile.jsx
│   ├── AdminPanel.jsx
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── AdminRoute.jsx
│   ├── Forbidden.jsx
│   ├── CategoryFilter.jsx
│   ├── IncidentSidebar.jsx
│   ├── RadiusSlider.jsx
│   ├── PhotoGallery.jsx
│   ├── ReporterCard.jsx
│   └── MiniMap.jsx
├── contexts/
│   ├── AuthProvider.jsx
│   └── CategoriesProvider.jsx
└── utils/
    ├── timeAgo.js
    ├── buildIncidentPopup.js
    ├── getStatusBadge.js
    └── getPhotoThumbnails.js
```

---

## Database Schema

### users
| Column | Type | Notes |
|---|---|---|
| user_id | BIGINT PK | Auto-generated |
| google_id | VARCHAR | Unique, from Google sub claim |
| email | VARCHAR | Unique |
| name | VARCHAR | |
| avatar_url | VARCHAR | Google profile picture URL |
| role | ENUM | USER, ADMIN |
| created_at | DATETIME | |

### incident_categories
| Column | Type | Notes |
|---|---|---|
| category_id | INT PK | Auto-generated |
| name | VARCHAR | Fire, Road Hazard, etc. |
| icon_name | VARCHAR | Material symbol or emoji |
| color_hex | VARCHAR | Hex color for map marker |

### incidents
| Column | Type | Notes |
|---|---|---|
| incident_id | BIGINT PK | Auto-generated |
| user_id | BIGINT FK | References users |
| category_id | INT FK | References incident_categories |
| title | VARCHAR | |
| description | TEXT | |
| lat | DECIMAL(10,7) | |
| lng | DECIMAL(10,7) | |
| status | ENUM | ACTIVE, RESOLVED, FLAGGED |
| upvote_count | INT | Default 0 |
| occurred_at | DATETIME | |
| created_at | DATETIME | |

### incident_photos
| Column | Type | Notes |
|---|---|---|
| id | BIGINT PK | |
| incident_id | BIGINT FK | References incidents |
| url | VARCHAR | Relative path e.g. /uploads/abc.jpg |
| uploaded_at | DATETIME | |

### incident_votes
| Column | Type | Notes |
|---|---|---|
| id | BIGINT PK | |
| incident_id | BIGINT FK | References incidents |
| user_id | BIGINT FK | References users |
| voted_at | DATETIME | |
| | | Unique constraint on (incident_id, user_id) |

---

## REST API Endpoints

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /auth/google | Public | Verify Google ID token, return JWT |

### Incidents
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/incidents | User | Fetch nearby incidents (lat, lng, radiusKm) |
| GET | /api/incidents/{id} | User | Fetch incident detail |
| GET | /api/incidents/categories | User | Fetch all categories |
| POST | /api/incidents | User | Report new incident |
| POST | /api/incidents/{id}/photos | User | Upload photos (multipart) |
| PUT | /api/incidents/{id}/vote | User | Toggle upvote |
| PUT | /api/incidents/{id}/status | Admin | Change incident status |
| DELETE | /api/incidents/{id} | Admin | Delete incident |

### Users
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/users/me | User | Get current user profile |
| GET | /api/users/me/incidents | User | Get current user's incidents |
| DELETE | /api/users/me/incidents/{id} | User | Delete own incident |

### Admin
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/admin/incidents | Admin | Paginated all incidents |
| GET | /api/admin/stats | Admin | Incident counts by status |

---

## Environment Variables

### Backend — application.properties
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/lumina_db
spring.datasource.username=your_username
spring.datasource.password=your_password

jwt.secret=your_base64_encoded_secret_min_32_chars
jwt.expiration=3600000

google.client.id=your_google_client_id.apps.googleusercontent.com

file.upload-dir=uploads
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=20MB
```

### Frontend — .env
```
VITE_OLA_MAPS_API_KEY=your_ola_maps_api_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_API_BASE_URL=http://localhost:8080
```

---

## Setup Instructions

### Prerequisites
- Java 21
- Node.js 18+
- MySQL 8+
- Maven

### Backend
```bash
# 1. Create MySQL database
CREATE DATABASE lumina_db;

# 2. Configure application.properties with your DB credentials and keys

# 3. Run the application
./mvnw spring-boot:run
```

### Frontend
```bash
# 1. Install dependencies
npm install

# 2. Create .env file with required variables

# 3. Start development server
npm run dev
```

### First Run
1. Open http://localhost:5173
2. Sign in with your Google account
3. Allow location access when prompted
4. To promote yourself to admin, run this SQL:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

5. Log out and log back in for the new role to take effect

---

## Key Architecture Decisions

**Google OAuth2 — Pattern B (Frontend-driven)**
React handles the Google sign-in popup via @react-oauth/google. The resulting ID token is sent to the backend POST /auth/google. The backend verifies the token with Google using GoogleIdTokenVerifier, finds or creates the user in the database, and issues its own JWT. Google is not involved in any subsequent API requests.

**JWT — Stateless authentication**
No server-side sessions. The JWT contains email, userId, and role as claims. JwtAuthFilter validates every protected request by parsing the token — no database call needed per request. The SecurityContext principal is set to the user's email, accessible via SecurityContextHolder in any controller or service.

**Haversine geo query**
Two-step approach: SQL bounding box pre-filter (cheap, uses indexes) followed by precise Haversine distance calculation in the same native query. Results are ordered by distance ascending. Java-side distance recalculation provides the distanceKm field on each IncidentDto returned to the frontend.

**MapStruct for DTO mapping**
Compile-time annotation processor generates mapper implementations. IncidentMapper handles nested objects (User to UserSummaryDto, IncidentCategory to CategoryDto) and custom field extraction (List of IncidentPhoto to List of String for photo URLs). distanceKm and userHasVoted are set manually in the service layer after mapping since they require additional logic or database calls that MapStruct cannot perform.

**CategoriesProvider scoped inside ProtectedLayout**
Initially placed app-wide, causing GET /api/incidents/categories to fire on the login page (no JWT present) returning 401, which the Axios interceptor handled by redirecting to /login, causing an infinite refresh loop. Fixed by moving CategoriesProvider inside ProtectedLayout so it only mounts after authentication is confirmed by ProtectedRoute.

**Optimistic upvote updates**
Vote count and userHasVoted state update instantly on click before the API call completes. Pre-click values are saved as local variables. On API success, response values overwrite the optimistic values. On failure, the saved pre-click values are restored and a toast error is shown.

**File storage — local filesystem**
Uploaded photos are saved to an uploads/ directory on the server filesystem with UUID-prefixed filenames (preventing path traversal and name collisions). Spring serves them as static resources via WebMvcConfigurer mapping /uploads/** to the filesystem location. The Security config permits all requests to /uploads/** without authentication so photos are publicly viewable.

---

## Days Completed

| Day | Task |
|---|---|
| 1 | Project scaffolding — Spring Boot + React + MySQL setup |
| 2 | Database schema — all 5 tables |
| 3 | JPA entities and repositories |
| 4 | Haversine geo query, DTOs, MapStruct mappers |
| 5 | Spring Security, JWT filter, SecurityConfig |
| 6 | Google OAuth2 setup, Ola Maps SDK setup |
| 7 | /auth/google endpoint, GoogleAuthService, GlobalExceptionHandler |
| 8 | React auth integration — AuthContext, LoginPage, Axios interceptor |
| 9 | Protected routes, UserProfile, GET /api/users/me |
| 10 | Role-based access, AdminRoute, ForbiddenPage, @PreAuthorize |
| 11 | Incidents read API — nearby, detail, categories, AOP logging |
| 12 | Incidents write API — create, vote toggle, status update, delete |
| 13 | Photo upload API — FileStorageService, multipart endpoint, static serving |
| 14 | Map foundation — Ola Maps integration, geolocation, incident markers |
| 15 | Full popup cards — buildIncidentPopup, timeAgo, photo thumbnails, vote from popup |
| 16 | Filter panel, radius slider with debounce, incidents sidebar, marker Map refactor |
| 17 | Report incident form — validation, photo preview, two-step API submit |
| 18 | Incident detail page — gallery, mini map, optimistic upvote, userHasVoted |
| 19 | User dashboard — stats, My Reports, delete own incidents |
| 20 | Admin panel — paginated table, inline status change, stats bar, search, pagination |
| 21 | Navbar, routing cleanup, ProtectedLayout, 404 page |