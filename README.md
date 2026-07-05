# Muhammad Ihsan Ramadhan

Personal portfolio site with an admin dashboard for self-managing content.

**Live:** [ihsan.is-a.dev](https://ihsan.is-a.dev) &nbsp;·&nbsp; **API:** [api.ihsan.is-a.dev](https://api.ihsan.is-a.dev/api/v1)

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

pnpm --filter api exec prisma generate
pnpm --filter api exec prisma migrate dev
pnpm --filter api exec prisma db seed
```

### Running

```bash
# API
pnpm --filter api run start:dev

# Web
pnpm --filter web run dev
```

### Testing

```bash
# API (Jest)
pnpm --filter api run test
pnpm --filter api run test:cov

# Web (Vitest)
pnpm --filter web run test
pnpm --filter web run test:cov
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
| `GET` | `/experience` | Work experience |
| `GET` | `/education` | Education history |
| `GET` | `/interests` | Interests list |
| `GET` | `/sections` | Section visibility and order |
| `GET` | `/github/activity` | GitHub contribution activity |
| `POST` | `/contact` | Submit contact form |

**Admin** (requires JWT)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/login` | Get JWT token |
| `PATCH` | `/admin/profile` | Update bio, headline |
| `POST` | `/admin/profile/photo` | Upload profile photo |
| `DELETE` | `/admin/profile/photo` | Delete profile photo |
| `GET` | `/admin/projects` | All projects (including hidden) |
| `POST` | `/projects` | Create project |
| `PATCH` | `/projects/:id` | Update project |
| `DELETE` | `/projects/:id` | Delete project |
| `PATCH` | `/admin/projects/:id` | Customize project data |
| `POST` | `/admin/projects/upload-image` | Upload project preview image |
| `DELETE` | `/admin/projects/image` | Delete project image |
| `POST` | `/admin/skills` | Add skill |
| `PATCH` | `/admin/skills/:id` | Update skill |
| `DELETE` | `/admin/skills/:id` | Delete skill |
| `POST` | `/admin/experience` | Add experience |
| `PATCH` | `/admin/experience/:id` | Update experience |
| `DELETE` | `/admin/experience/:id` | Delete experience |
| `POST` | `/admin/education` | Add education |
| `PATCH` | `/admin/education/:id` | Update education |
| `DELETE` | `/admin/education/:id` | Delete education |
| `POST` | `/admin/interests` | Add interest |
| `PATCH` | `/admin/interests/:id` | Update interest |
| `DELETE` | `/admin/interests/:id` | Delete interest |
| `PATCH` | `/admin/sections/:id` | Toggle section visibility |
| `PUT` | `/admin/sections/reorder` | Reorder sections |
| `POST` | `/admin/sync/trigger` | Trigger GitHub sync |
| `GET` | `/admin/sync/status` | Last sync status |
| `GET` | `/admin/sync/history` | Sync history |
| `GET` | `/admin/messages` | View contact inbox |
| `PATCH` | `/admin/messages/:id/read` | Mark message as read |
| `DELETE` | `/admin/messages/:id` | Delete message |

Commits follow [Conventional Commits](https://www.conventionalcommits.org).