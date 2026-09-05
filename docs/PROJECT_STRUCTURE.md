# Project structure

```text
client/
  src/app/App.jsx        # routes, UI screens, state and API integration
  src/styles/index.css   # responsive design system
  src/main.jsx           # React bootstrap
server/
  prisma/                # MySQL schema and demo seed script
  src/middleware/        # JWT authentication and role protection
  src/services/          # deterministic eligibility engine
  src/app.js             # REST API routes and server setup
  test/                  # automated eligibility tests
docs/                    # implementation and project documentation
```

Generated folders (`node_modules/`, `client/dist/`) are excluded from source organization and are recreated by package commands.
