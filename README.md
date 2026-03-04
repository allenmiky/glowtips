# GlowTips

Premium, comfort-focused tipping platform scaffold with strict frontend/backend separation.

## Structure

- `frontend`: Next.js app (UI, forms, API calls, realtime listeners only)
- `backend`: Express API + WebSocket service (auth, ledger, payouts, alerts, admin)

## Run locally

### 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Backend URL: `http://localhost:5000`
Swagger: `http://localhost:5000/docs`

### 2) Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend URL: `http://localhost:3000`

## Core architecture

- API versioning: `/api/v1/*`
- Auth: JWT access + refresh tokens
- Ledger accounting: balance computed from `ledger_entries` (credits/debits)
- Realtime: Socket.io path `/alerts`, event `tip:confirmed`
- Anti-spam: message filter in tip intent flow
- Safety: rate limiting, validation, centralized error middleware, logging

## Deployment

- Frontend: deploy independently (Vercel or static compatible target)
- Backend: deploy independently (VPS/Railway/Render), Dockerfile included
- Both services are decoupled and communicate via HTTP/WebSocket only