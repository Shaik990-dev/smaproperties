# SMA Properties — Claude Instructions

## Project
Next.js 15 App Router · Firebase Realtime Database + Auth + Storage · Vercel deployment  
Repo: github.com/Shaik990-dev/smaproperties · Root: `nextjs-app/`

## Git & Deployment Workflow (ALWAYS follow this — no exceptions)

### Two permanent branches
| Branch | Vercel environment | URL |
|--------|-------------------|-----|
| `main` | **Production** | smaproperties.in |
| `dev`  | **Dev preview** | smaproperties-git-dev-umarshaiks-projects.vercel.app |

### Every change follows this exact flow
```
1. git checkout dev && git pull origin dev
2. git checkout -b fix/<topic>   OR   feature/<topic>
3. Make all changes on this branch
4. git push origin fix/<topic>   → Vercel creates a one-off preview
5. git checkout dev && git merge fix/<topic> && git push origin dev
   → Vercel auto-deploys the DEV environment (user verifies here)
6. Only after user confirms: git checkout main && git merge dev && git push origin main
   → Vercel auto-deploys PRODUCTION
```

**Never commit directly to `main` or `dev`.**  
**Never push to main without explicit user approval.**  
After the user says "looks good" or "merge to main" — then and only then push to main.

### When user says "commit" or "push"
- Commit + push to the current feature branch and merge into `dev` automatically.
- Do NOT push to `main` unless the user explicitly says so.

## Vercel
- Team: `team_19vlluibNvxMac9s7fBH9KF0` (umarshaiks-projects)
- Project: `smaproperties`
- Env vars managed via Vercel MCP — never store secrets in code.

## Key files
- `src/data/agents.ts` — single source of truth for all phone numbers and WA numbers. Never hardcode phones anywhere else.
- `src/lib/firebase-admin.ts` — server-only Firebase Admin SDK (API routes only).
- `src/lib/firebase.ts` — client-side Firebase SDK.
- `public/sw.js` — service worker; cache busting via `/api/sw-version` (returns `VERCEL_GIT_COMMIT_SHA`).

## Code rules
- All `target="_blank"` links must have `rel="noopener noreferrer"`.
- Phone fields validate with `/^[6-9]\d{9}$/` before submission.
- No hardcoded phone/WhatsApp numbers — always use `AGENTS[0].phones[0]` or `AGENTS[0].whatsapp`.
- Tailwind opacity modifier (`/95`) does NOT work with hex CSS variables — use full hex directly (e.g. `bg-[#0F2342]`).
- No `new Date()` in `src/app/sitemap.ts` — use fixed date constants.

## Before finishing any task
1. Check for TypeScript errors (imports, typos in module paths).
2. Confirm Vercel build is READY after pushing to dev before merging to main.
