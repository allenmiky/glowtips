# GlowTips Backend

Express + TypeScript API server for auth, creators, tips, ledger wallet, withdrawals, alerts, and admin.

## Features

- Versioned REST APIs (`/api/v1/*`)
- JWT auth + refresh token endpoint
- Prisma PostgreSQL models with ledger-based accounting
- Redis connection support
- Rate limiting + anti-spam filter
- Socket.io realtime alerts (`path: /alerts`, event: `tip:confirmed`)
- Swagger UI at `/docs`
- Dockerfile + `.env.example`