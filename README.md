# ✨ Mini Blog / Notes

Современное fullstack-приложение для заметок и коротких постов: с чистой архитектурой, приятным UX и заделом под production.

---

## 🚀 Что уже реализовано

- **Frontend** на React + TypeScript с feature-структурой модулей.
- **Backend** на Node.js + Express + Prisma.
- Базовый сценарий заметок: создание, список, поиск, pin/delete.
- Поддержка **Markdown** для контента заметок.
- Черновик с **автосохранением в localStorage**.
- Готовая Prisma-схема для `User` и `Note`.

---

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
- SQLite (по умолчанию, легко переключить на PostgreSQL)
- JWT-ready auth skeleton

### DX / Infra
- Monorepo через npm workspaces
- Подготовленная структура под ESLint/Prettier/CI

---

## 📂 Структура проекта

```text
.
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── router/
│       │   └── store/
│       ├── modules/
│       │   ├── auth/
│       │   ├── notes/
│       │   └── users/
│       └── shared/
├── backend/
│   ├── prisma/
│   └── src/
│       └── modules/
│           ├── auth/
│           └── notes/
└── tests/
```

---

## ⚙️ Быстрый старт

### 1) Установка зависимостей

```bash
npm install
```

### 2) Настройка переменных окружения

Создайте файл `backend/.env`:

```env
PORT=4000
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-me"
```

### 3) Запуск backend

```bash
npm run dev --workspace backend
```

### 4) Запуск frontend

```bash
npm run dev --workspace frontend
```

---

## 🔌 Примеры API-запросов

### Регистрация

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"u@u.com","username":"user","password":"password"}'
```

### Логин

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"u@u.com","password":"password"}'
```

### Получение заметок

```bash
curl http://localhost:4000/api/notes
```

### Создание заметки

```bash
curl -X POST http://localhost:4000/api/notes \
  -H 'Content-Type: application/json' \
  -d '{"title":"Hello","content":"# post"}'
```

---

## 🎨 UI/UX-концепция

- **Mobile-first** вёрстка.
- Минималистичные карточки заметок.
- Markdown-рендеринг в ленте.
- Базовые микро-анимации появления элементов.
- Основа для светлой/тёмной темы.

---

## 🧪 Тестирование

В проект добавлен пример unit-теста (`tests/filterNotes.test.ts`) для утилиты фильтрации заметок.

Запуск тестов после установки зависимостей:

```bash
npm run test --workspace frontend
npm run test --workspace backend
```

---

## 📈 Идеи для масштабирования

1. Выделить backend-слои: `controllers / use-cases / repositories`.
2. Добавить полноценную JWT-аутентификацию с refresh token.
3. Реализовать синхронизацию черновиков между устройствами.
4. Подключить full-text search (PostgreSQL `tsvector` или Meilisearch).
5. Добавить Redis-кэш и очередь фоновых задач.
6. Вынести медиа в S3-совместимое хранилище.
7. Настроить CI/CD, линтинг, форматирование и quality gates.

---

## 🛠️ Статус

Это **качественный стартовый каркас** проекта. Он уже удобен для дальнейшей продуктовой разработки, но требует доработки бизнес-логики (auth, полноценный CRUD, синхронизация, права доступа) для production-релиза.
