# FIX-Karachi
Citizen issue reporting platform for Karachi — report civic problems, route them to the right authority, track resolution, and view public transparency stats.  Hackathon theme: Fix Karachi: Building a Better World for the Future (ZABEFEST 2026)

Tech stack
Layer	Technology
Frontend	React (Vite), Tailwind CSS, Leaflet maps, Socket.IO
Backend	Node.js, Express.js, JWT auth, Multer uploads
Database	PostgreSQL, Sequelize ORM
Project structure
Hackathon/
├── Frontend/          # React SPA (port 3000)
├── Backend/           # Express API (port 5000)
├── DEMO_CREDENTIALS.md
└── README.md
Setup
1. Backend
cd Backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npm run db:migrate
npm run db:seed
npm run dev
2. Frontend
cd Frontend
npm install
cp .env.example .env
npm run dev
Open http://localhost:3000

Seeded demo credentials
See DEMO_CREDENTIALS.md for full details.

Role	Email	Password
Citizen	citizen@fixkarachi.pk	ChangeMe123!
KMC Authority	kmc@fixkarachi.pk	ChangeMe123!
Admin	admin@fixkarachi.pk	ChangeMe123!
8-step judge demo flow
Login as citizen@fixkarachi.pk
Submit a Garbage complaint with photo + GPS pin
System auto-assigns to KMC
Login as kmc@fixkarachi.pk → see assigned complaint
Set status to In Progress
Upload resolution proof and mark Resolved
Login as citizen → view status + before/after images
Open Public Transparency Dashboard at /dashboard → verify updated stats
API health check
GET http://localhost:5000/health

Environment variables
Backend (Backend/.env.example): DATABASE_URL, JWT_SECRET, ADMIN_EMAIL, CORS_ORIGIN, seed passwords

Frontend (Frontend/.env.example): VITE_API_URL=http://localhost:5000/api
