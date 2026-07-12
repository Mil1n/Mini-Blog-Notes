# ✨ Mini Blog / Notes

Современное fullstack-приложение для заметок и коротких постов: React + TypeScript frontend, Express + Prisma backend, Markdown, черновики, теги, категории и JWT-аутентификация.

## 🚀 Что реализовано

- Frontend на React + TypeScript с feature-структурой модулей.
- Backend на Node.js + Express + Prisma.
- JWT-регистрация и логин с bcrypt-хэшированием паролей.
- CRUD API заметок с правами доступа владельца.
- Создание, список, поиск, pin/delete/favorite/draft.
- Поддержка Markdown и live preview в редакторе.
- Черновик с автосохранением и восстановлением из `localStorage`.
- Prisma-схема для `User` и `Note`, seed-данные для demo-аккаунта.
- Базовые typecheck/build/test quality gates.

## 🧱 Технологический стек

### Frontend
- React 18
- TypeScript
- React Router
- Zustand
- Tailwind CSS
- react-markdown
- framer-motion

### Backend
- Node.js + Express
- Prisma ORM
- SQLite по умолчанию
- JWT auth
- bcryptjs
- zod validation

## ⚙️ Быстрый старт

```bash
npm install
```

Создайте `backend/.env`:

```env
PORT=4000
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-me"
```

Подготовьте Prisma Client и базу:

```bash
npm run prisma:generate --workspace backend
npm run prisma:migrate --workspace backend
npm run seed --workspace backend
```

Запуск backend:

```bash
npm run dev --workspace backend
```

Запуск frontend:

```bash
npm run dev --workspace frontend
```

Demo-пользователь после seed:

```text
email: demo@example.com
password: password
```

## 🔌 API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/notes`
- `POST /api/notes`
- `PATCH /api/notes/:id`
- `DELETE /api/notes/:id`

Для `/api/notes` нужен заголовок:

```http
Authorization: Bearer <token>
```

## 🧪 Проверки

```bash
npm run typecheck --workspaces
npm run test --workspaces
npm run build --workspaces
```

## 📈 Дальнейшие идеи

1. Refresh tokens и logout endpoint.
2. PostgreSQL + отдельные таблицы для тегов.
3. Full-text search через PostgreSQL `tsvector` или Meilisearch.
4. Архив заметок вместо физического удаления.
5. CI/CD с GitHub Actions.
6. S3-совместимые вложения и изображения.
