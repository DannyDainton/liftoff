# LiftOff

Interactive learning platform with real-time Postman API validation. Learners complete hands-on steps in Postman, then validate their work through the app — earning points and ranks as they progress.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), connect your Postman API key, and start a module.

## How It Works

1. **Learner connects** with their Postman API key
2. **Each step** has instructions and a **Validate** button
3. Clicking Validate calls the Postman API (server-side, via Next.js route handlers) to verify the learner actually completed the step
4. Successful validation awards **10 points** per step
5. Points unlock **ranks and badges** on the dashboard

### Architecture

```
Browser → POST /api/postman/validate → Server-side validator → Postman API
                                                             → Artemis API (for mission steps)
```

All Postman API calls happen server-side to avoid CORS issues. The learner's API key is passed per-request and never stored on the server.

---

## Creating Modules

Adding new learning content is simple — write a markdown file and let the tooling do the rest. Module content is just structured markdown: `# headings` become lessons, `### steps` become validated tasks. No code required to author content.

```
/liftoff-module create [--badge]   → new module from markdown
/liftoff-module update [--badge]   → add lessons to an existing module
/liftoff-module badge              → generate a badge for an existing module
/liftoff-module sync               → regenerate missing validators
```

The skill parses your markdown, generates the module definition, creates server-side validators that check the learner's Postman workspace, and wires everything into the app automatically.

Each module can include a **completion badge** — a 512x512 PNG displayed when the learner finishes all steps. Pass `--badge` to auto-generate one via the Google Gemini API, or place a `badge.png` manually in the module directory. Requires a `GEMINI_API_KEY` in `.env.local`.

**[Full module authoring guide →](docs/creating-a-module.md)**

---

## Project Structure

```
src/
├── app/                          # Next.js App Router pages + API routes
│   ├── api/postman/              # Server-side Postman API proxy
│   │   ├── validate/route.ts     # Unified validation endpoint
│   │   └── validate-key/route.ts # API key verification
│   ├── auth/                     # Authentication page
│   ├── modules/                  # Module lesson pages
│   └── results/                  # Score and rank display
├── components/                   # React components
│   ├── auth/                     # ApiKeyForm, AuthGuard
│   ├── lesson/                   # StepCard, ValidateButton, ProgressBar
│   └── scoring/                  # PointsDisplay, RankBadge
├── content/modules/              # Module definitions (one dir per module)
│   └── artemis-mission-control/
│       └── module.json           # Lessons, steps, validator mappings
├── context/                      # React contexts (auth, progress)
├── lib/
│   ├── postman-api.ts            # Server-side Postman API client
│   ├── validators/               # Validator functions (one subdir per module)
│   │   ├── index.ts              # Registry mapping validatorId → function
│   │   └── artemis-mission-control/
│   ├── scoring.ts                # Rank definitions and calculation
│   └── content-loader.ts         # Module/lesson data loader
└── types/                        # TypeScript type definitions
```

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

No environment variables required — the app is stateless. All API keys are provided by the learner at runtime.

### Railway / Any Node.js Host

```bash
npm run build
npm start
```

The app runs on port 3000 by default. Set the `PORT` environment variable to change it.

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Scoring

| Rank | Points | Badge |
|------|--------|-------|
| Space Cadet | 0 | 🌟 |
| Mission Specialist | 50 | 🛰️ |
| Commander | 100 | ⭐ |
| Flight Director | 500 | 🚀 |
| Galaxy Brain | 1,000 | 🧠 |
| Supernova | 5,000 | 💥 |
| Mass Relay | 10,000 | 🌌 |

Badge milestones at 50, 100, 500, 1K, 5K, and 10K points.

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** with dark glassmorphism theme
- **React Context + localStorage** for state persistence
- **Postman API** for workspace/collection/environment validation
