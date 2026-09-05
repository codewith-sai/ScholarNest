# ScholarNest MVP implementation plan

1. Build an Express REST API with JWT authentication, role checks, validation, Prisma/MySQL data models, and demo-only seed records.
2. Keep eligibility deterministic in a dedicated server service. Rules are stored as relational criterion rows, evaluated against a student profile, and returned with explanations.
3. Build a responsive React/Vite/Tailwind interface: public/auth flows, profile stepper, student discovery and tracking features, and protected administration features.
4. Add API and eligibility tests, build the client, and document local MySQL setup, demo credentials, and the verification boundary for scholarship data.

## Scope notes

All seeded scholarships and their URLs are conspicuously **DEMO — UNVERIFIED**. ScholarNest only reports that the entered profile appears to meet stored criteria; students must verify current requirements on an official portal before applying.
