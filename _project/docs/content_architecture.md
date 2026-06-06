# Budgeting Simulator — Content Architecture

---

## Core Principle: Data Driven Design

The simulator engine and the simulator content are intentionally separated. The engine stays lean and generic — it never knows about specific scenarios. Content lives in data, not code.

**The engine handles:**
- Rendering scenes and characters
- Processing budget and envelope mechanics
- Triggering and resolving events
- Evaluating badges and consequences

**The content layer defines:**
- What scenarios exist
- What events are possible
- What NPCs say and do
- What expenses apply
- What badges are available

Adding a new scenario, avatar, job type, or event type requires adding new content — not changing engine code.

---

## Content Types

### Scenario Templates
Define the starting parameters for each playable scenario.
- Avatar type — Young Single, Couple with 2 Children, Empty Nesters
- Job type — Employee, Gig Worker, Small Business Owner
- Income range — min, max, distribution curve
- Housing options — rent or buy, available by avatar type
- Pay frequency — weekly, bi-weekly, twice a month, monthly, variable
- Expense profile reference — which expense library applies
- Starting cash formula — calculated to ensure round one survivability

### Expense Libraries
Define monthly and recurring expenses by scenario context.
- Expense name
- Amount range — fixed or variable
- Due day of month
- Frequency — monthly, bi-monthly, annual
- Type — fixed, variable, discretionary
- Applicable avatars — which life stages this expense applies to
- Applicable housing — rent only, own only, or both

### Event Libraries
Define all possible events the engine can trigger.

**Core Event Types:**
1. **Expected Expense** — planned, coming due, player should have allocated for it
2. **Unexpected Expense** — unplanned, draws from whatever envelope makes sense
3. **Spending Opportunity** — optional, player chooses to engage or not
4. **Income Event** — regular or variable depending on job type
5. **Earning Opportunity** — chance to bring in more — extra shift, new client, side job
6. **Notification** — something is coming or has changed, delivered via scenario channel
7. **NPC Moment** — a character creates a situation that may affect money, mood, or decisions

**Underlying Mechanics:**
- **Discovery** — a trigger mechanism, not a standalone event. Surfaces when a player takes an action. Triggers another event, a required decision, or an optional decision with potential consequences.
- **Decision** — a side effect, not a standalone event. May follow any event type. Can be required or optional. Optional decisions carry potential consequences if ignored.

**Event Record Fields:**
- Event ID and name
- Type — from core event types above
- Trigger conditions — day of week, day of month, envelope balance threshold, scenario state
- Weight — probability relative to other events
- Income and budget proportionality — scales to player's scenario
- Notification channel — defined at scenario level, not event level
- Outcome — spending draw, reallocation prompt, NPC moment, consequence trigger
- Applicable avatars and job types

### Core Event Library — Cycle One

A generalized guide. Mechanics and details to be defined during development.

**1. Expected Expense**
- Rent or mortgage due
- Utility bill due
- Insurance payment due

**2. Unexpected Expense**
- Car repair needed
- Medical co-pay
- Home or apartment maintenance issue

**3. Spending Opportunity**
- Grocery store visit
- Gas station fill up
- Sale at a store on the commute

**4. Income Event**
- Weekly paycheck arrives
- Bonus or overtime added
- Payment received *(gig/business)*

**5. Earning Opportunity**
- Extra shift available
- New client inquiry *(business owner)*
- Side job offer

**6. Notification**
- Bill coming due soon
- Subscription renewing
- Rent increase notice

**7. NPC Moment**
- Boss assigns overtime
- Landlord requests maintenance access
- Store clerk offers loyalty discount

### Notification Channels
Notifications are a delivery mechanism, not an event type. The event defines what happened and what it affects. The channel defines how the player discovers it. Channels are defined at the scenario level — swapping channels requires no changes to the event library.

**Available Channels:**
- In app alert — modern default
- Simulator email — player checks their inbox
- Snail mail — player must go to the mailbox to discover it
- Phone call — NPC calls the player
- In person — NPC tells them face to face
- Environmental — billboard, store signage, overheard conversation

**How it works:**
- Each scenario template defines which event types use which channels
- The event library is channel agnostic — it defines what happens, not how the player finds out
- A retro scenario swaps snail mail for email — the event and its consequences remain identical
- Channel choice can itself become a teaching moment — ignoring the mailbox means missing a bill notification

### NPC Dialogue Trees
Define what characters say and how they respond.
- NPC ID — boss, store staff, bank staff, landlord, customers
- Situation keys — routine, event driven, consequence, opportunity
- Dialogue options — keyed to scenario context and player state
- Response branches — player choices and NPC reactions

### Badge Definitions
Define all badges and the conditions for earning, tarnishing, and restoring them.
- Badge ID and name
- Type — behavior, milestone, mindset
- Earning condition — specific action, result, or pattern of behavior
- Tarnish condition — behavior or result that indicates drift from the skill
- Restore condition — returning to the practice that earned the badge
- Display — icon, description, tarnished state visual

### Badge Set — Cycle One
A core set of 5 to 10 badges across all three types — behavior, milestone, and mindset. To be defined during development.

---
Define the visual environments and what is available in each.
- Scene ID — home, workplace, store, bank, street
- Available NPCs by scene
- Available actions by scene
- Ambient events possible in scene

---

## Content Storage

### Cloudflare D1
- Scenario templates
- Expense libraries
- Event libraries
- Badge definitions

### Cloudflare R2
- NPC dialogue trees — JSON files
- Scene definitions — JSON files
- Visual assets — avatars, NPCs, backgrounds, icons

### Cloudflare KV
- Cached active content for current scenario — loaded at scenario init, fast runtime access

---

## Content Build Order
Content is built iteratively alongside the engine. Start simple, expand with each cycle.

**Cycle 1:**
- 3 avatar types
- 3 job types
- Weekly pay frequency
- Employee expense profile
- Core event library — cycle one guide above
- Basic NPC dialogue — boss, store staff, bank staff, landlord
- Core badge set — 5 to 10 badges across all three types

**Future Cycles:**
- Additional pay frequencies
- Expanded event libraries
- Richer NPC dialogue trees
- Partner / couple scenario content
- Additional badge sets
- New scene environments

---

## Open Content Questions
- [ ] What are the first 5 to 10 badges?
- [ ] What does the boss say on a routine workday versus an event driven one?
- [ ] How detailed are dialogue trees in cycle one?
- [ ] How are content updates versioned and deployed without breaking active scenarios?
