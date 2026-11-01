# FixKarachi

Citizen issue reporting platform for Karachi — report civic problems, route them to the right authority, track resolution, and view public transparency stats.

**Hackathon theme:** Fix Karachi: Building a Better World for the Future (ZABEFEST 2026)

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite), Tailwind CSS, Leaflet maps, Socket.IO |
| Backend | Node.js, Express.js, JWT auth, Multer uploads |
| Database | PostgreSQL, Sequelize ORM |

## Project structure

```
Hackathon/
├── Frontend/          # React SPA (port 3000)
├── Backend/           # Express API (port 5000)
├── DEMO_CREDENTIALS.md
└── README.md
```

## Setup

### 1. Backend

```bash
cd Backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npm run db:migrate
npm run db:seed
npm run dev
```

### 2. Frontend

```bash
cd Frontend
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000

## Seeded demo credentials

See **[DEMO_CREDENTIALS.md](./DEMO_CREDENTIALS.md)** for full details.

| Role | Email | Password |
|------|-------|----------|
| Citizen | `citizen@fixkarachi.pk` | `ChangeMe123!` |
| KMC Authority | `kmc@fixkarachi.pk` | `ChangeMe123!` |
| Admin | `admin@fixkarachi.pk` | `ChangeMe123!` |

## 8-step judge demo flow

1. Login as **citizen@fixkarachi.pk**
2. Submit a **Garbage** complaint with photo + GPS pin
3. System auto-assigns to **KMC**
4. Login as **kmc@fixkarachi.pk** → see assigned complaint
5. Set status to **In Progress**
6. Upload **resolution proof** and mark **Resolved**
7. Login as citizen → view status + before/after images
8. Open **Public Transparency Dashboard** at `/dashboard` → verify updated stats

## API health check

`GET http://localhost:5000/health`

## Environment variables

**Backend** (`Backend/.env.example`): `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `CORS_ORIGIN`, seed passwords

**Frontend** (`Frontend/.env.example`): `VITE_API_URL=http://localhost:5000/api`
