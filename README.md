# Muhammad Ihsan Ramadhan

Personal portfolio site with an admin dashboard for self-managing content.

**Live:** [ihsanramadhan.my.id](https://ihsanramadhan.my.id) &nbsp;·&nbsp; **API:** [api.ihsanramadhan.my.id](https://api.ihsanramadhan.my.id/api/v1)

---

## Stack

```
portfolio/
├── apps/
│   ├── web/
│   └── api/
└── packages/
    └── shared-types/
```

| Layer | Tech | Hosting |
|---|---|---|
| Frontend | React, Vite, TypeScript, Tailwind CSS, Framer Motion | Vercel |
| Backend | NestJS, Fastify, Prisma ORM, Passport JWT | Render |
| Database | Supabase | Supabase |
| Storage | Supabase Storage | Supabase |

---

## Features

- Admin dashboard - manage profile, projects, skills, and view contact messages
- Contact form - messages stored in DB and viewable in admin inbox
- Dark/light mode - follows system preference, user-toggleable

---

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org)
- [pnpm](https://pnpm.io)
- [Supabase](https://supabase.com)
- [GitHub Personal Access Token](https://github.com/settings/tokens) - classic, `public_repo` scope

### Setup

```bash
git clone https://github.com/ihsan-ramadhan/portfolio
cd portfolio
pnpm install

cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

pnpm --filter api prisma generate
pnpm --filter api prisma migrate dev
pnpm --filter api prisma db seed
```

### Running

```bash
# API
pnpm --filter api run start:dev

# Web
pnpm --filter web run dev
```

---

## API Reference

Base URL: `/api/v1`

**Public**

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/profile` | Profile data |
| `GET` | `/projects` | All visible projects |
| `GET` | `/projects/featured` | Pinned/featured projects |
| `GET` | `/skills` | Skills list |
| `POST` | `/contact` | Submit contact form |

**Admin** (requires JWT)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/admin/auth/login` | Get JWT token |
| `PATCH` | `/admin/profile` | Update bio, headline |
| `POST` | `/admin/profile/photo` | Upload profile photo |
| `GET` | `/admin/projects` | All projects (including hidden) |
| `PATCH` | `/admin/projects/:id` | Customize project data |
| `POST` | `/admin/projects/upload-image` | Upload project preview image |
| `POST` | `/admin/skills` | Add skill |
| `PATCH` | `/admin/skills/:id` | Update skill |
| `DELETE` | `/admin/skills/:id` | Delete skill |
| `POST` | `/admin/sync/trigger` | Trigger GitHub sync |
| `GET` | `/admin/sync/status` | Last sync status |
| `GET` | `/admin/sync/history` | Sync history |
| `GET` | `/admin/messages` | View contact inbox |
| `PATCH` | `/admin/messages/:id/read` | Mark message as read |
| `DELETE` | `/admin/messages/:id` | Delete message |

---

## Deployment

| App | Platform | Domain |
|---|---|---|
| `apps/web` | Vercel | `ihsanramadhan.my.id` |
| `apps/api` | Render | `api.ihsanramadhan.my.id` |

---

## Branch Strategy

```
main       ← production
└── develop
    ├── feat/*
    ├── fix/*
    └── perf/*
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org).