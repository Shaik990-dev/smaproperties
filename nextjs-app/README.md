# SMA Builders & Real Estates — Next.js

Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Firebase rebuild of the SMA Builders real-estate website. Deployed on Vercel, data persisted in Firebase Realtime Database, auth via Firebase Authentication.

## Quick start

```bash
cd nextjs-app
cp .env.local.example .env.local        # values are pre-filled with the existing sma-builders-c09ec project
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

```
nextjs-app/
├── public/                      # static assets (favicon, logos)
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # root layout (Navbar + Footer + AuthProvider)
│   │   ├── page.tsx             # home page
│   │   ├── globals.css          # Tailwind v4 entry + theme tokens
│   │   ├── properties/
│   │   │   ├── page.tsx         # property listing with filters
│   │   │   └── [id]/page.tsx    # dynamic property detail page
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── account/page.tsx     # signed-in user dashboard
│   │   └── admin/
│   │       ├── layout.tsx       # admin guard (only isAdmin users)
│   │       └── page.tsx         # dashboard
│   ├── components/
│   │   ├── layout/              # Navbar, Footer
│   │   ├── sections/            # Hero, FeaturedProperties, About, etc.
│   │   ├── property/            # PropertyCard, PropertyGallery, PropertyFilters
│   │   ├── auth/                # AuthProvider (context), AuthModal
│   │   └── ui/                  # Button, Badge — primitive UI building blocks
│   ├── lib/
│   │   ├── firebase.ts          # Firebase init (db + auth singletons)
│   │   ├── auth.ts              # signIn / signUp / signOut helpers
│   │   ├── properties.ts        # CRUD on /properties
│   │   ├── visitors.ts          # anonymous visit tracking
│   │   ├── users.ts             # CRUD on /users
│   │   ├── types.ts             # shared TypeScript types
│   │   └── utils.ts             # cn(), waLink(), formatPhone()
│   └── data/
│       ├── properties.ts        # default seed data (6 properties)
│       └── agents.ts            # Sk. Ahamad + Sk. Umar contact info
├── .env.local.example
├── next.config.ts
├── package.json
├── tsconfig.json
└── postcss.config.mjs
```

## Deploying to Vercel

1. Push this folder to GitHub
2. In Vercel → Add New Project → import the repo → set **Root Directory** to `nextjs-app`
3. Add environment variables from `.env.local.example` in Vercel → Settings → Environment Variables
4. Deploy

## Migration from the static site

The original static `index.html` lives in `../files/` as a backup. Data in Firebase (`/properties`, `/users`, `/visitors`) is unchanged — this Next.js app reads/writes the same paths, so existing data is preserved.
