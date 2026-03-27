# Weekly Scenario Design — Round One

---

## Overview
The first round is a weekly pay cycle. Each round is one week, beginning on Monday and closing on Sunday. The simulation opening experience — budget creation and initial allocation — happens once before the first round begins and is not part of the repeating weekly structure.

Each new round starts fresh but carries forward the consequences and momentum of the prior week.

---

## Day Structure
Each day has:
- **Required tasks** — must be completed to unlock the next day
- **Optional but Consequential** — available but carry real world consequences if ignored
- **Optional Activities** — available once required tasks are done
- **Possible Events** — semi-random, proportional to income and budget

### Possible Events *(any day)*
- Bill notification arrives
- Boss mentions upcoming schedule or assigns extra task
- Gas price has shifted since last fill up
- Small impulse opportunity — coffee, a sale at a store nearby
- Unexpected expense surfaces

---

## Repeating Patterns

### Workday *(Employee — 9 to 5)*
Appears as a required task on every weekday. Details vary by job type.

**Required:**
- Morning commute — get to work
- Clock in
- Complete work tasks
- Boss interaction — routine or event driven
- Clock out
- Evening commute home

**Optional:**
- Fill up gas when needed
- Small impulse opportunity on the commute — coffee, a store passed on the way
- Check bank balance
- Review budget and envelopes

**Commute Consequence *(Car Commuter)*:**
- Gas gauge is a background variable — consequence triggers if tank runs too low
- Gas too low and ignored — car breaks down, late arrival, boss interaction triggered, emergency expense drawn from an envelope

---

## Monthly Expenses

Monthly expenses are triggered by day of the month, not day of the week. At scenario launch, the expense profile is determined based on the player's avatar, job type, income, and housing choice. This profile pre-loads starting cash reserves to ensure the player can survive through round one.

### Expense Types

**Fixed — same day every month:**
- Rent or mortgage — 1st of the month
- Car payment — consistent due date
- Phone bill
- Internet/cable
- Insurance — car, renters, or homeowners, health
- Gym membership
- Streaming subscriptions

**Variable but recurring:**
- Electric/gas utility — arrives mid month, amount varies by season
- Water bill — often bi-monthly
- Credit card payment — due date varies
- Medical/dental payment plan

**Less frequent but requiring monthly awareness:**
- Annual expenses broken into monthly awareness — car registration, holiday gifts, back to school
- Savings transfer — if the player has set one up

### Expense Profile by Avatar

**Young Single:**
- Rent, phone, internet, car payment, car insurance, one or two subscriptions, electric utility
- Lower overall load, but limited margin

**Couple with 2 Children:**
- Mortgage or rent, two phones, internet, car payment/s, car insurance, health insurance, childcare, subscriptions, electric and gas utility, water
- Higher load, more categories competing for the same dollars

**Empty Nesters:**
- Mortgage, phones, internet, car payments, car insurance, health insurance, subscriptions, electric and gas utility, water, possible medical payment plan
- Load has accumulated over years — lifestyle creep is the primary risk

### Pre-Loading Logic
At scenario launch:
1. Avatar + job type + income + housing choice are selected
2. Expense profile is generated from the variables above
3. Starting cash is calculated to cover:
   - Any expenses due in the first week
   - A small buffer above zero to simulate existing savings
   - Enough to make it through round one without hitting a wall before learning begins
4. Budget creation begins with the expense profile already in play — the player sees what's coming

### What This Teaches
- Expenses cluster around certain dates — the 1st is always heavy
- Some expenses arrive as surprises if the player hasn't been paying attention
- Forward planning and allocation ahead of due dates reduces anxiety
- Connects directly to the BFF flywheel — storing resources for known upcoming expenses

---

Transportation type is determined by the player's housing choice and life context. It is not a fixed expense — it is a dynamic variable that teaches cash flow awareness and planning.

**Transportation Types:**
- **City dweller** — public transit, fixed and predictable cost, less dynamic
- **Remote worker** — no commute cost, but potentially other expenses that offset
- **Car commuter** — dynamic gas expense, bought when needed, affected by distance and gas prices

**Car Commuter Dynamics:**
- Gas is purchased when the tank runs low, not on a schedule
- The player must notice the gauge and decide when to fill up
- Waiting too long creates risk — running out on the way to work
- Filling up frequently in small amounts versus less often in larger amounts teaches cash flow awareness
- Gas prices can fluctuate, introducing a subtle market variable

**What This Teaches:**
- Not all expenses arrive on a schedule
- Some expenses require attention and anticipation
- Dynamic expenses draw from the transportation envelope unpredictably — connecting directly to the reallocation mechanic
- Housing choice at setup has downstream consequences the player discovers through play

---

## Round Bookends

### Start of Round Screen
Shown at the beginning of each new round. Content varies by scenario. To be defined during development.

### End of Round Screen
Shown at the close of each completed round. Content varies by scenario. Natural BASE Evaluate moment. To be defined during development.

---

### Monday
A routine day — no payday, no major events expected. Monday establishes the baseline rhythm the player will measure everything else against.

**Required Tasks:**
- Workday

---

### Tuesday

**Required Tasks:**
- Workday

---

### Wednesday

**Required Tasks:**
- Workday

---

### Thursday

**Required Tasks:**
- Workday

---

### Friday *(Payday)*

**Required Tasks:**
- Workday

---

### Saturday

**Required Tasks:**
- To be defined

---

### Sunday *(End of Round)*

**Required Tasks:**
- To be defined

---

## Open Design Questions
- [ ] What required tasks appear on each day?
- [ ] What NPC interactions are available by day?
- [ ] What events are possible each day and with what frequency?
- [ ] How does payday interaction differ by job type?
- [ ] What does the end of round screen show and prompt?
