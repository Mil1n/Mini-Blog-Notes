# Mini Blog / Notes (Modern Production-Ready Starter)

## Stack
- Frontend: React + TypeScript + Tailwind + Zustand + React Router + React Markdown
- Backend: Node.js + Express + Prisma + SQLite (easy to switch to PostgreSQL)
- DX: ESLint/Prettier hooks can be added via shared config

## Run
```bash
npm install
npm run dev --workspace backend
npm run dev --workspace frontend
```

## ENV
Create `.env` in `backend/`:
```env
PORT=4000
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-me"
```

## API examples
```bash
curl -X POST http://localhost:4000/api/auth/register -H 'Content-Type: application/json' -d '{"email":"u@u.com","username":"user","password":"password"}'
curl -X POST http://localhost:4000/api/auth/login -H 'Content-Type: application/json' -d '{"email":"u@u.com","password":"password"}'
curl http://localhost:4000/api/notes
curl -X POST http://localhost:4000/api/notes -H 'Content-Type: application/json' -d '{"title":"Hello","content":"# post"}'
```

## UI notes
- Mobile-first layout, minimal cards, markdown preview, pin/delete controls.
- Theme-ready CSS foundation and animated note appearance.
- Draft autosave to localStorage.

## Scaling ideas
1. Split backend by clean architecture layers: controllers/use-cases/repositories.
2. Add Redis caching + queue for feed generation.
3. Replace polling with websockets for collaborative updates.
4. Add full-text search (PostgreSQL tsvector or Meilisearch).
5. Move file/media storage to S3-compatible object storage.
