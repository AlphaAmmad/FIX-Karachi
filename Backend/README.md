# FIX KARACHI Backend

Production-ready Node.js, Express.js, PostgreSQL, Sequelize backend for citizen issue reporting and resolution.

## Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT
- Bcrypt
- Multer
- Socket.io

## Setup

1. Copy `.env.example` to `.env` and update credentials.
2. Install dependencies with `npm install`.
3. Start PostgreSQL and create the database.
4. Run `npm run dev`.

## Scripts

- `npm run dev` - start in development mode
- `npm start` - start in production mode
- `npm run seed:admin` - seed the default admin account
- `npm run db:migrate` - apply Sequelize migrations
- `npm run db:seed` - run Sequelize seeders

## Production Flow

1. Set environment variables.
2. Run `npm run db:migrate`.
3. Run `npm run db:seed`.
4. Start the app with `npm start`.

## Health Check

- `GET /health`
