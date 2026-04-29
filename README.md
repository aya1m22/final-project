# FASHIONAI

Monorepo scaffold for the Graduation project.

Status: Day 1 & Day 2 implemented (scaffold, DB, auth backend, frontend skeleton, email verification, toasts).

Key files:
- [backend/src/routes/auth.ts](backend/src/routes/auth.ts) — JWT auth (register/login/refresh/logout), email verification (Nodemailer/Ethereal).
- [frontend/src/pages/Login.tsx](frontend/src/pages/Login.tsx) — Login page calling backend and storing tokens.
- [frontend/src/pages/Register.tsx](frontend/src/pages/Register.tsx) — Register page calling backend and showing verification notices.
- [frontend/src/context/ToastContext.tsx](frontend/src/context/ToastContext.tsx) — simple global toast provider.
- [database/prisma/schema.prisma](database/prisma/schema.prisma) — Prisma schema + seed script.

Run locally (from workspace root):

1) Install dependencies:

```bash
npm install
```

2) Setup DB (Prisma + seed):

```bash
npm --workspace=database run prisma:generate
npm --workspace=database run prisma:push
npm --workspace=database run seed
```

3) Start backend:

```bash
npm --workspace=backend run dev
```

4) Start frontend:

```bash
npm --workspace=frontend run dev
```

Notes:
- The register endpoint returns an Ethereal preview URL (dev) and a `verifyUrl` to complete verification during development.
- I couldn't create a Jira board or push the repo to a remote without your credentials. I can do those if you provide the remote URL or a GitHub token.
