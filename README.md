# Renart

A full-stack monorepo application built with modern web technologies, featuring
a type-safe API layer and a responsive product showcase interface.

## Tech Stack

### Backend (`apps/server`)

- **Next.js 15** - Full-stack React framework
- **tRPC** - End-to-end typesafe APIs
- **Drizzle ORM** - TypeScript ORM for SQL databases
- **Neon Postgres** - Serverless Postgres database
- **Zod** - Schema validation

### Frontend (`apps/web`)

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **Embla Carousel** - Lightweight carousel component

## Project Structure

```
renart/
├── apps/
│   ├── server/          # tRPC API server
│   │   ├── src/
│   │   │   ├── routers/ # API endpoints
│   │   │   ├── db/      # Database schema & connection
│   │   │   └── lib/     # Utilities & context
│   │   └── drizzle.config.ts
│   └── web/             # Frontend application
│       └── src/
│           ├── app/     # Next.js app router
│           └── components/
└── package.json         # Monorepo root
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10.12.4+
- Neon Postgres database

### Installation

```bash
# Install dependencies
pnpm install
```

### Environment Setup

Create a `.env` file in `apps/server/`:

```env
DATABASE_URL=your_neon_postgres_url
DATABASE_URL_POOLER=your_pooler_url
CORS_ORIGIN=http://localhost:3001
```

> **Note:** You can create your own [Neon](https://neon.tech) database or I can
> share the database URL used in the project if you want.

Create a `.env.local` file in `apps/web/`:

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### Development

```bash
# Run all apps in development mode
pnpm dev

# Run specific apps
pnpm dev:server  # API server on port 3000
pnpm dev:web     # Web app on port 3001
```

### Database Commands

```bash
# Push schema changes to database
pnpm db:push

# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Open Drizzle Studio
pnpm db:studio
```

## Deployed URLs

### Production

- **Web App**: [https://renart-web.vercel.app](https://renart-web.vercel.app)
- **Server API**:
  [https://renart-server.vercel.app](https://renart-server.vercel.app)
- **Products Endpoint**:
  [https://renart-server.vercel.app/trpc/product.getAll](https://renart-server.vercel.app/trpc/product.getAll)

### API Examples

**Get all products:**

```
https://renart-server.vercel.app/trpc/product.getAll
```

**Filter by price range:**

```
https://renart-server.vercel.app/trpc/product.getAll?priceMin=500&priceMax=1000
```

**Filter by popularity:**

```
https://renart-server.vercel.app/trpc/product.getAll?popularityMin=0.8&popularityMax=1.0
```

**Combine multiple filters:**

```
https://renart-server.vercel.app/trpc/product.getAll?priceMin=600&priceMax=900&popularityMin=0.85
```

## Features

- 🔒 **Type-safe API** - Full end-to-end type safety with tRPC
- 🎨 **Responsive Design** - Mobile-first carousel interface
- ⚡ **Fast Development** - Turbopack for lightning-fast builds
- 🗄️ **Serverless Database** - Neon Postgres with connection pooling
- 🎯 **Monorepo** - Turborepo for efficient workspace management
- 🔍 **Product Filtering** - Advanced filtering by price and popularity
