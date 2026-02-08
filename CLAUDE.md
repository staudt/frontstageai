# Frontstage AI

Config-driven platform that turns AI workflows into branded, standalone apps.
No chat UI — just input in, result out. A thin facade over multimodal models.

## Quick Start

```bash
cp .env.example .env      # add your API key
# edit flow.yaml           # customize your flow
npm run dev                # starts frontend (5173) + backend (3001)
```

## Architecture

```
flow.yaml + .env
      ↓
┌─────────────────────┐
│  Express (port 3001) │ → GET /api/config (sanitized, no secrets)
│                       │ → POST /api/run (input → AI → result)
│  Provider adapters    │ → OpenAI, Anthropic, Google
│  Zod YAML validation  │
└─────────────────────┘
      ↓
┌─────────────────────┐
│  React + Vite (5173) │ → Camera / Upload / Text input
│  Tailwind CSS         │ → Loading state
│  CSS variable theming │ → Section / Markdown output
└─────────────────────┘
```

Dev: Vite proxies `/api/*` to Express. Prod: Express serves built static files.

## Key Paths

- `flow.yaml` — THE config file that defines the entire app
- `server/config.ts` — YAML loader + Zod schema + `toClientConfig` sanitizer
- `server/providers/types.ts` — `AIProvider` interface (all adapters implement this)
- `server/providers/` — OpenAI, Anthropic, Google adapters
- `server/routes/ai.ts` — `POST /api/run` (core execution pipeline)
- `server/routes/config.ts` — `GET /api/config` (serves frontend-safe config)
- `src/App.tsx` — Root component, state machine: input → loading → result
- `src/components/` — UI components (CameraCapture, FileUpload, ResultDisplay, etc.)
- `src/hooks/` — useConfig, useFlow, useCamera
- `src/main.css` — Tailwind + CSS custom properties + template themes

## Conventions

- All YAML config access goes through `server/config.ts` (never parse YAML elsewhere)
- Provider adapters implement `AIProvider` interface from `server/providers/types.ts`
- Frontend never sees AI prompts, model, or provider — sanitized by `toClientConfig`
- Theming uses CSS custom properties, templates use `[data-template]` scoping in CSS
- Icons are inline SVG components in `src/lib/icons.tsx`
- No chat, no streaming — single request/response per flow execution

## Scripts

- `npm run dev` — Vite (5173) + Express (3001) concurrently
- `npm run build` — Production build (frontend to `dist/`, server to `dist-server/`)
- `npm start` — Production server
- `npm run typecheck` — Type-check both frontend and server

## Data Flow

```
User input (camera/upload/text)
  → Frontend: useFlow hook POSTs { image?, text? } to /api/run
  → Backend: loads flow.yaml, interpolates prompt, picks provider
  → Provider: calls AI API (OpenAI/Anthropic/Google)
  → Backend: parses sections from response (JSON → fallback regex)
  → Frontend: renders SectionResult or MarkdownResult
```

## Template System

Templates are CSS variable overrides scoped by `[data-template="name"]` in `src/main.css`.
Brand colors from `flow.yaml` are applied at runtime via JS on `document.documentElement.style`.
Priority: CSS defaults → template CSS → brand YAML overrides (highest).

## MVP Roadmap

### Done
- [x] Phase 1: Project foundation (Vite + React + Tailwind + Express)
- [x] Phase 2: Config & provider layer (Zod schema, YAML loader, OpenAI adapter, API routes)
- [x] Phase 3: Input layer (camera, upload, text components)
- [x] Phase 4: Output & results (sections, markdown, loading, errors)
- [x] Phase 5: Branding & templates (CSS variables, default + mystic templates)

### To Do
- [ ] Phase 6: Palm reader polish (prompt tuning, camera UX, animations)
- [ ] Phase 7: Additional providers (Anthropic + Google adapters — code exists, needs testing)
- [ ] Phase 8: Documentation & GitHub polish (README, demo GIF, deployment guide)

## Post-MVP Roadmap

- CLI scaffolding: `npx frontstage init --template palm-reader`
- More templates: corporate, playful, retro, neon
- Image generation flows: DALL-E / Stability AI output (haircut preview use case)
- Hosted service: deploy flows to a shared platform with custom URLs
- Multi-step flows: chain multiple AI calls
- Auth & rate limiting for deployed apps
- Analytics: track usage per flow
- Docker: `docker run` deployment
