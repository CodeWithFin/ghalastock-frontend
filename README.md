# Ghala Web

Production-ready Next.js frontend for **Ghala** — a multi-tenant inventory management SaaS built for Kenyan businesses.

## Stack

- **Next.js 14** (App Router) + TypeScript (strict)
- **Tailwind CSS v3** + shadcn/ui components
- **Zustand** for client state (auth, UI)
- **TanStack Query v5** for server state
- **React Hook Form + Zod** for forms
- **Axios** HTTP client with auth interceptors
- **Recharts** for dashboard charts
- **@zxing/browser** for barcode scanning
- **Framer Motion** on the landing page only
- **Sonner** for toast notifications

## Prerequisites

- Node.js 18+
- npm 9+
- Ghala API running (default: `http://localhost:3001/api/v1`)

## Setup

```bash
# Clone the repository
git clone git@github.com:CodeWithFin/ghalastock-frontend.git
cd ghalastock-frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Backend integration

The frontend talks to [ghalastock-backend](https://github.com/CodeWithFin/ghalastock-backend) at `NEXT_PUBLIC_API_URL`.

### Run both apps locally

```bash
# Terminal 1 — API (from ghalastock-backend repo)
cd ../ghalastock-backend
cp .env.example .env
docker compose -f docker/docker-compose.yml up postgres -d
npm install && npm run migrate && npm run seed
npm run dev

# Terminal 2 — Frontend
cd ghalastock-frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Default seed login: `admin@acme.com` / `password123`

### How requests are mapped

- JWT is sent as `Authorization: Bearer <token>` on every API call
- API responses in snake_case are converted to camelCase in `lib/api/transform.ts`
- Stock in/out payloads map `lines` → `items` and `notes` → `globalNotes`
- Item fields map `minStock` → `min_stock` when saving
- Transaction undo uses `DELETE /transactions/:id` (admin only)
- Dashboard composes extra data (low stock list, expiry alerts, movement chart) from multiple API calls

Set `APP_URL=http://localhost:3000` in the backend `.env` so CORS allows the browser in production mode.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001/api/v1` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Ghala` |
| `NEXT_PUBLIC_APP_URL` | Frontend URL | `http://localhost:3000` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Docker

### Build and run

```bash
docker build -t ghala-web .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://host.docker.internal:3001/api/v1 \
  -e NEXT_PUBLIC_APP_URL=http://localhost:3000 \
  ghala-web
```

### Docker Compose (with API)

```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://api:3001/api/v1
      NEXT_PUBLIC_APP_URL: http://localhost:3000
```

## Route Reference

### Public (unauthenticated)

| Route | Description |
|-------|-------------|
| `/` | Marketing landing page |

### Auth

| Route | Description |
|-------|-------------|
| `/login` | Email + password login |
| `/signup` | Organization registration |
| `/accept-invite` | Accept team invite and set password |

### Dashboard (authenticated)

| Route | Description | Access |
|-------|-------------|--------|
| `/dashboard` | Overview with stats and charts | All roles |
| `/items` | Inventory list with filters | All roles |
| `/items/new` | Batch add multiple items | Staff, Admin |
| `/stock-in` | Record incoming stock | Staff, Admin |
| `/stock-out` | Dispatch stock to shops (FEFO) | Staff, Admin |
| `/expiring` | Products nearing expiry | All roles |
| `/transactions` | Transaction history | All roles |
| `/shops` | Shop locations | All roles |
| `/users` | Team management | Admin only |
| `/settings` | Organization and account settings | All roles |

## Project Structure

```
app/
├── (public)/          # Landing pages
├── (auth)/            # Login, signup, invite
├── (dashboard)/       # Protected inventory app
components/
├── landing/           # Marketing sections
├── layout/            # Sidebar, topbar, mobile nav
├── dashboard/         # Dashboard widgets
├── items/             # Inventory components
├── stock/             # Stock in/out forms
├── scanner/           # Barcode scanner
├── transactions/      # Transaction tables
├── users/             # Team management
└── ui/                # Shared UI primitives
lib/
├── api/               # Axios API modules
├── hooks/             # TanStack Query hooks
├── store/             # Zustand stores
├── schemas/           # Zod validation schemas
└── utils/             # Formatters and helpers
types/                 # TypeScript interfaces
middleware.ts          # Route protection
```

## Auth Flow

1. Login/signup stores JWT in `localStorage` and `ghala_token` cookie
2. Middleware checks cookie for protected routes
3. Axios interceptor attaches `Authorization: Bearer <token>`
4. 401 responses clear auth and redirect to `/login`

## Role-Based Access

| Role | Permissions |
|------|-------------|
| **Admin** | Full access including users, shops, undo |
| **Staff** | Stock operations, item management |
| **Viewer** | Read-only — no create/edit/delete actions |

## License

Proprietary — Ghala © 2025
