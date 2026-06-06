# Budgeting Simulator — Technical Architecture

---

## Stack Overview

### Frontend
- **Nuxt 3** — SPA mode, file based routing, API routes via Nitro
- **Vue-Konva / Konva** — canvas based simulator UI, characters, scenes, interactions
- **Pinia** — state management for budget, envelopes, scenario, and player state

### Backend — Cloudflare
- **Cloudflare Workers** — serverless API logic via Nuxt Nitro deployment
- **Cloudflare D1** — SQLite based database for persistent data
- **Cloudflare R2** — object storage for static assets
- **Cloudflare KV** — key value store for fast session and game state caching

---

## Frontend Architecture

### Nuxt Configuration
- SSR disabled — running as SPA
- Nitro preset: cloudflare-pages or cloudflare-workers
- API routes handled server side via Nitro

### Canvas Layer — Konva
- Simulator world rendered on Konva canvas
- Vue-Konva bridges Vue 3 reactivity with Konva rendering
- Scenes: home, workplace, store, bank, street
- Characters: player avatar, NPCs (boss, store staff, bank staff, landlord)
- UI elements: budget panel, envelope viewer, calendar, badge display

### State Management — Pinia

**Stores:**
- `playerStore` — avatar, job type, income, housing choice, profile
- `scenarioStore` — current scenario, week, day, pay frequency, expense profile
- `budgetStore` — categories, envelope balances, allocations, transaction history
- `calendarStore` — current day, week, month, upcoming expenses, event queue
- `badgeStore` — earned badges, tarnished badges, behavior tracking
- `eventStore` — active events, consequences, NPC interaction queue

---

## Backend Architecture

### API Routes — Nitro / Cloudflare Workers
- `/api/scenario/init` — generate scenario from selected variables
- `/api/scenario/state` — save and load scenario state
- `/api/budget/allocate` — process envelope allocations
- `/api/budget/spend` — process spending transactions
- `/api/budget/reallocate` — process envelope reallocation
- `/api/events/next` — generate next event based on scenario state
- `/api/badges/evaluate` — evaluate badge conditions and tarnish logic
- `/api/player/profile` — create and update player profile

### Database — Cloudflare D1

**Tables:**
- `players` — id, name, created_at
- `scenarios` — id, player_id, avatar, job_type, income, housing, pay_frequency, expense_profile, created_at
- `scenario_state` — id, scenario_id, week, day, status, saved_at
- `envelopes` — id, scenario_id, category, allocated, spent, balance
- `transactions` — id, scenario_id, envelope_id, amount, type, description, day, week
- `expenses` — id, scenario_id, name, amount, due_day, frequency, type
- `events` — id, scenario_id, type, description, day, week, resolved, consequence
- `badges` — id, player_id, type, name, earned_at, tarnished, tarnished_at, restored_at

### Asset Storage — Cloudflare R2
- Avatar images
- NPC character images
- Scene backgrounds — home, workplace, store, bank, street
- UI elements and icons
- Audio files — ambient, interactions (future)

### Session & Cache — Cloudflare KV
- Active session state
- Current day and week cache
- Event queue cache
- Badge evaluation cache

---

## Scenario Engine

### Initialization
1. Player selects avatar, job type, housing
2. Income semi-randomly generated within range for avatar + job type
3. Expense profile generated from avatar + housing + income
4. Starting cash calculated to cover first week expenses plus buffer
5. Calendar pre-loaded with monthly expenses on their due dates
6. Event queue initialized with first week events

### Event Generation
- Events are semi-random but proportional to income and budget
- Event types: spending opportunity, unexpected expense, NPC interaction, bill notification, consequence
- Events pulled from queue daily — weighted by day of week and day of month
- Consequence events triggered by ignored optional but consequential actions

### Budget Cycle
- Allocation happens at start of each round on payday
- Spending draws from envelope balances in real time
- Reallocation available any time — requires conscious trade-off
- End of round evaluation compares predicted vs actual

---

## Round Length Strategy

Round length is a variable from day one — never hardcoded. The engine must treat round duration as a configuration value driven by the player's pay frequency, not an assumption baked into the logic.

**Pay frequency determines round length:**
- Weekly — 7 days
- Bi-weekly — 14 days
- Twice a month — variable, tied to calendar dates
- Monthly — full calendar month
- Variable — gig worker and small business owner, round length may fluctuate

**Implementation requirements:**
- All time based logic — event triggers, expense due dates, calendar progression — must reference round configuration, not hardcoded day counts
- The calendar engine reads pay frequency from the scenario record and calculates round boundaries dynamically
- Switching pay frequency in a future scenario requires no engine changes — only a content update

Failure to respect this from the start will create significant technical debt when additional pay frequencies are introduced.

---
How the envelope system looks and feels on the Konva canvas. Covers envelope display, allocation interaction, spending feedback, and reallocation mechanics. To be defined during development.

---

## Data Model
Full database schema in enough detail to build against. To be defined during development.

---
The simulator engine is intentionally generic. All scenario specific content lives in a separate content layer, keeping the codebase lean as scenarios and options grow. See the **Content Architecture Document** for full detail.

---

## Open Technical Questions
- [ ] Authentication — guest play vs saved profiles?
- [ ] Multiplayer / partner mode — shared scenario state?
- [ ] Offline capability — service worker for PWA?
- [ ] Analytics — tracking learning behaviors and badge patterns?
- [ ] Versioning — how scenario and budget schema evolve over time?
