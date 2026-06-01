# CARE Capstone Project — Frontend Documentation

Welcome to the frontend application for the **CARE Capstone Project**, a responsive React application designed for expectant mothers and their partners/husbands to track pregnancy wellness, manage prenatal appointments, view statistics, and stay connected throughout the journey.

---

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/) (built on top of [Vite](https://vite.dev/))
- **Styling**: [TailwindCSS v3](https://tailwindcss.com/) & [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand v5](https://zustand.docs.pmnd.rs/) (lightweight, hook-based state management)
- **API Client**: [Axios](https://axios-http.com/) (configured with auth token interception and request caching)
- **Date Manipulation**: [date-fns v4](https://date-fns.org/)

---

## 📂 Project Structure

```text
CARE_Capstone_Project-main/CARE_Capstone_Project/
├── public/                # Static assets (favicons, logos)
├── src/
│   ├── api/               # API clients, configurations, and endpoint endpoints
│   │   ├── client.js      # Base Axios client with authorization & GET caching
│   │   ├── index.js       # Toggle interface between mock and real API services
│   │   ├── realServices.js# Production API connectors communicating with Django REST Framework
│   │   └── services.js    # Endpoint aggregator
│   ├── assets/            # App styles, images, and fonts
│   ├── components/        # Reusable component units
│   │   ├── auth/          # Authentication layouts and guards
│   │   ├── layout/        # Shared layouts (DashboardLayout with navigation)
│   │   └── ui/            # UI components (Button, Card, Badge, Modal, Spinner)
│   ├── contexts/          # Context providers for theme/system configuration
│   ├── mock/              # Client-side offline mocking layer
│   │   ├── mockServices.js# Fallback service implementations for local-first execution
│   │   └── seedData.js    # Pre-populated demo profiles, daily logs, and appointments
│   ├── pages/             # Route-level page components
│   │   ├── AppointmentsPage.jsx # Prenatal appointments manager
│   │   ├── DailyLogPage.jsx     # Wellness inputs & symptom checklists
│   │   ├── DashboardPage.jsx    # Metrics grid, pregnancy progress, and status alerts
│   │   ├── LandingPage.jsx      # Welcome landing page
│   │   ├── LoginPage.jsx        # Credentials login form
│   │   ├── RegisterPage.jsx     # Registration flow
│   │   ├── ProfilePage.jsx      # Account edits, avatar upload, and partner unlinking
│   │   ├── PartnerStatsPage.jsx # Analytics and logs view for connected partner
│   │   └── StatsPage.jsx        # Data visualization and charts (sleep, mood, exercise)
│   ├── store/             # Zustand state slices
│   │   ├── authStore.js   # Stores authenticated user information and profile details
│   │   ├── pregnancyStore.js # Stores appointments, logs summary, and pregnancy milestone calculations
│   │   └── themeStore.js  # Dark mode toggler
│   ├── utils/             # Helper utilities
│   ├── App.jsx            # Main app router and provider declarations
│   ├── main.jsx           # Vite application bootstrap script
│   └── index.css          # Core CSS stylesheet and styling variables
├── tailwind.config.js     # Tailwind design system configurations
└── vite.config.js         # Build system & dev proxy settings
```

---

## 🔑 Key Features & Core Flows

### 1. Authentication & JWT Interceptors
- **Sign In/Sign Up**: Credentials are saved via `authStore`. JWT tokens (`access_token` and `refresh_token`) are persisted in `localStorage`.
- **Authorization Headers**: The request interceptor inside `client.js` automatically embeds the token: `Authorization: Bearer <Token>`.
- **Auto-Refresh**: If a request fails with a `401 Unauthorized` error, the response interceptor catches it, automatically sends a POST to `/api/auth/token/refresh/` using the refresh token, updates the access token, and retries the original request seamlessly.

### 2. Profile Management & Avatar Uploads
- **Text Updates**: Profile details (nickname, about) are sent to `/api/profile/me/` using a JSON `PATCH` request.
- **Avatar Media**: Profile pictures (JPG, PNG, WebP) are uploaded to `/api/profile/avatar/` using `multipart/form-data` requests.
- **R2 Cloudflare Integration**: If R2 is enabled on the Django backend, avatar media urls automatically render from Cloudflare R2 object storage.

### 3. Partner Connection
- **Role Validation**: Users are assigned complementary roles: **Mother** (`mother`) or **Partner / Husband** (`husband`).
- **Linking**: Users share their unique 8-character invite code. Linking accounts establishes a bidirectional relation, syncing stats, wellness logs, and shared appointment dates.
- **Dynamic Render**: 
  - **Mother Dashboard**: Always displays her pregnancy progress bar and countdown.
  - **Husband Dashboard**: Automatically displays the pregnancy countdown card when linked, or shows a card prompting him to connect with his partner if not yet linked.

### 4. Wellness Logs & Prenatal Appointments
- **Daily logs**: Allows tracking of sleep hours, daily exercise minutes, mood choices (😄 Great, 😊 Good, 😐 Neutral, 😔 Bad, 😢 Terrible), and optional symptom descriptions or notes. Mothers can write optional notes for partners, which display on the husband's dashboard.
- **Appointments**: Full-featured calendar manager allowing scheduling of check-ups, setting reminders (days before), location tagging, and marking appointments as completed.

---

## ⚡ Performance Optimization: Client-Side API Caching

To guarantee instant transitions and eliminate loading screens when users navigate back to pages they've already visited, a client-side **in-memory request cache** is integrated at the Axios layer inside `client.js`.

### 🔄 How it Works:
1. **Caching GET Requests**: Any successful `GET` request (e.g. fetching profiles, logs, appointments) is stored in a memory cache `Map` using a combination of the endpoint URL and JSON parameters as the key.
2. **Instant Delivery**: When navigating back to a page, if the request key is already in the cache, the Axios request interceptor cancels the actual network request and immediately resolves with the cached response. Since it resolves synchronously, React batches the state updates, completely bypassing loading screens and spinners.
3. **Automatic Cache Busting (Invalidation)**: Whenever the user triggers a mutation (`POST`, `PUT`, `PATCH`, `DELETE` requests) such as saving a log, adding an appointment, or updating a profile, the cache is instantly cleared (`cache.clear()`). This ensures that the subsequent navigation loads fresh data from the server.
4. **Session-Bound**: Refreshing the browser resets the JS execution context, which naturally wipes the in-memory cache and fetches fresh data from the backend.

---

## 💻 Local Development Setup

### ⚙️ Environment Configuration
Create a `.env` file in the root of `CARE_Capstone_Project-main/CARE_Capstone_Project/`:

```env
# URL pointing to your Django backend server (production or local)
VITE_API_URL=http://localhost:8000

# Set to "true" to run offline with mocked seed data, or "false" to connect to backend
VITE_USE_MOCK=false
```

### 🛠️ Developer Commands
Run the following commands inside `CARE_Capstone_Project-main/CARE_Capstone_Project/`:

```bash
# Install dependencies
npm install

# Start Vite dev server locally (defaults to http://localhost:5173)
npm run dev

# Lint code for errors
npm run lint

# Compile and optimize frontend code for production
npm run build

# Preview production build locally
npm run preview
```