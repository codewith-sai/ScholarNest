# ScholarNest MVP

ScholarNest is an eligibility-based scholarship discovery and guidance platform. It does **not** submit applications or certify official eligibility.

## What is implemented

- React/Vite/Tailwind responsive UI for landing, authentication, profile stepper, dashboard, search, details, saved scholarships, manual application tracking, notifications, and protected admin management.
- Express + Prisma/MySQL REST API with bcrypt password hashing, JWT authentication, role authorization, input validation, useful errors, and admin account enable/disable controls.
- Relational scholarship eligibility criteria, documents, saved items, application tracking, and notifications.
- A dedicated deterministic eligibility evaluator returning matching and unmet-rule explanations.
- Demo-only seed listings and development accounts. Their rules, benefits, and URLs are deliberately unverified examples—not official facts.

## Setup

1. Create a MySQL database named `scholarnest`.
2. Copy `.env.example` to `server/.env`, set `DATABASE_URL` and a strong `JWT_SECRET`.
3. From the project root run `npm install`, then `npm run install:all`.
4. Run `npm run migrate --prefix server`, then `npm run seed --prefix server`.
5. Run `npm run dev` and visit `http://localhost:5173`.

## Demo development accounts

- Student: `student@scholarnest.local` / `Student@123`
- Admin: `admin@scholarnest.local` / `Admin@123`

These credentials are for local development only. Change them and set production secrets before deployment.

## Checks

Run `npm test` from the root. It runs deterministic eligibility tests and a production client build. A running MySQL database is needed for migrations, seed data, and full API interaction.

## Data safety boundary

Every seeded scholarship is visibly labeled **DEMO — UNVERIFIED**, uses an `example.com` placeholder URL, and warns users to check a verified official portal. Administrators are responsible for reviewing and entering current official details before any public use.
