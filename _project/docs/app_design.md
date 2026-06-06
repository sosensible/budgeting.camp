# Budgeting App — Design Document

---

## Core Purpose
An adaptive simulation that teaches budgeting not through instruction, but through experience. The learner doesn't take a course — they live a journey, shaped by their own reality and the frameworks of BASE, BFF, the 4 Goals, Mindset, Margin, and Money Relationships.

---

## The Learner Journey

### Setup
The simulator spins up a unique starting reality at launch by combining independent variables:

- **Avatar** — chosen by the player from three life stages:
  - Young Single
  - Couple with 2 Children
  - Empty Nesters
- **Job type** — chosen by the player:
  - Employee — steady predictable income, a boss, fixed hours
  - Gig Worker — variable income, no boss, feast and famine rhythm
  - Small Business Owner — revenue dependent on customers, higher ceiling and higher risk
- **Income** — semi-randomly generated within a range appropriate to the avatar and job type combination
- **Housing** — chosen by the player: rent or buy

Each combination creates a genuinely different financial reality. The same avatar at the same income level faces a fundamentally different journey depending on job type and housing choice. The simulator teaches through the combination, not through explanation.

### First Day Experience

**Entering the Simulation**
The player arrives on the first day of a month. A narrator welcomes them and orients them to the world — not teaching, just guiding engagement. From here, the characters inside the simulation carry the story and advice.

**Step 1 — Financial Reality Check**
The player sees their starting position: first check plus some existing money, enough to make it through. They review their known expenses — rent or mortgage, groceries, transportation, utilities, and others relevant to their avatar and job type combination.

**Step 2 — Create the Budget**
Using their known expenses, the player builds a budget — their prediction and plan. The budget becomes the guide for what goes where. This is the player's first act of intention with their money.

**Step 3 — Allocate to Envelopes**
Following the budget they just created, they assign money to categories. The budget guides the allocation — prediction becomes intention. BASE begins here, naturally, without being named.

**Step 4 — The Day Unfolds**
- A set of required tasks guides the player through the day
- Work schedule differs by job type:
  - Employee — shows up, works set hours, interacts with boss
  - Gig Worker — chooses when to work, income reflects effort
  - Small Business Owner — opens for business, customers drive the day
- Optional activities available once required tasks are complete
- Player chooses to continue exploring or advance to tomorrow

### Weekly Rhythm & Round Structure

**Pay Frequency as a Core Variable**
Pay frequency shapes the entire relationship between the player and their budget. Each creates a different rhythm, challenge, and learning opportunity:
- Weekly — more frequent allocation, more manageable increments
- Bi-weekly — most common, balancing frequency and planning horizon
- Twice a month — similar to bi-weekly but tied to calendar dates
- Monthly — demands the most planning and discipline
- Variable — gig worker and small business owner territory, the BFF flywheel challenge at its most visceral

Each pay frequency will be built out as its own scenario set, sharing core mechanics but with distinct rhythms and challenges. Build one frequency fully before adding the next.

**Round Structure**
- One round = one week
- A new round becomes available once the prior week is complete
- Progress moves day by day within each round
- Events and activities are tied to specific days — creating rhythm and surprise in equal measure

**Round Bookends**
- A common start screen or popup opens each new round
- A common end screen or popup closes each completed round
- Content varies based on the scenario — income received, budget performance, events that occurred, what's coming
- These bookends create rhythm and reflection — natural BASE Evaluate moments built into the flow of the game

*Note: Identify which pay frequency to build first before proceeding.*

---

## The NPC World
- **Employee path:** A boss who drives income events — hours, raises, unexpected demands
- **Business owner path:** Customers who drive revenue events — feast and famine, opportunity and loss
- **Store staff:** Spending interactions — groceries, gas, impulse opportunities
- **Bank staff:** Savings, overdraft moments, margin conversations
- **Landlord:** Fixed obligation, consequence if missed, stability implications
- *More NPCs to be added as the simulation matures*

---

## Challenges & Opportunities
- Semi-random, but proportional to income and budget
- Designed to keep the learner engaged without removing the consequence of budget decisions
- Curated to introduce specific teachings at appropriate moments
- Mirror the rhythm of real life — some weeks are quiet, some are eventful

---

## Badge System

### Three Types of Badges
- **Behavior badges** — earned through conscious choices: checking balance before spending, reallocating intentionally, staying within a category
- **Milestone badges** — earned through results: first month completed, emergency fund started, debt paid off, one month ahead in the budget
- **Mindset badges** — earned through patterns of choices over time, not a single decision but consistent practice

### Tarnishing
- Badges tarnish when the behavior or result that earned them is no longer being practiced or maintained
- A tarnished badge is a gentle signal, not a punishment — "you've drifted, here's what brought you here"
- Badges can be restored by returning to the practice that earned them
- Mirrors the reality that financial health isn't a destination — it's a living practice

### What the Badge System Teaches
- Skills require maintenance, not just acquisition
- Drift is normal — what matters is recognizing and returning
- The budget is always a reflection of current practice, not past achievement

---

## Onboarding Flow
The experience a brand new user has before the first round begins. Covers avatar selection, job type, income generation, housing choice, expense profile loading, initial budget creation, and envelope allocation. To be defined during development.

---

## Scoring and Progress Model
Beyond badges, how the player knows they are improving over time. To be defined during development.

---

## Solo vs Partner Mode
How the experience differs for a single player versus two people managing a shared budget. Partner mode deferred to a future cycle. To be defined during development.
- [ ] How many starting avatars and job types for the initial release?
- [ ] What is the first scenario — what does week one look like for a new player?
- [ ] How does the app introduce BASE without it feeling like a tutorial?
- [ ] What triggers a mindset badge specifically?
- [ ] How is the solo vs. partner experience differentiated?
- [ ] What does the tarnish mechanic look like visually?
