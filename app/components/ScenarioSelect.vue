<script setup lang="ts">
import { SCENARIO_CATALOG } from '~/stores/scenario'

defineEmits<{ select: [id: string] }>()

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<template>
  <div class="selector">
    <div class="header">
      <h1>Budgeting Camp</h1>
      <p class="subtitle">Choose a scenario to begin</p>
    </div>

    <div class="grid">
      <div
        v-for="s in SCENARIO_CATALOG"
        :key="s.id"
        class="card"
      >
        <div class="card-top">
          <span class="scenario-id">{{ s.id }}</span>
          <h2>{{ s.name }}</h2>
        </div>

        <ul class="stats">
          <li>
            <span class="stat-label">Starting Balance</span>
            <span class="stat-value">${{ fmt(s.startingChecking + s.startingSavings) }}</span>
          </li>
          <li>
            <span class="stat-label">Checking</span>
            <span class="stat-value">${{ fmt(s.startingChecking) }}</span>
          </li>
          <li>
            <span class="stat-label">Savings</span>
            <span class="stat-value savings">${{ fmt(s.startingSavings) }}</span>
          </li>
          <li>
            <span class="stat-label">Weekly Pay</span>
            <span class="stat-value pay">${{ fmt(s.weeklyPay) }}</span>
          </li>
          <li>
            <span class="stat-label">Locations</span>
            <span class="stat-value">{{ s.locationCount }}</span>
          </li>
        </ul>

        <button class="play-btn" @click="$emit('select', s.id)">
          Enter →
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.selector {
  min-height: 100vh;
  background: #1a1a2e;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1.5rem;
  font-family: system-ui, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 2.5rem;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #68d391;
  letter-spacing: -0.02em;
  margin: 0 0 0.4rem;
}

.subtitle {
  font-size: 1rem;
  color: #718096;
  margin: 0;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  max-width: 900px;
  width: 100%;
}

.card {
  background: #1e2a3a;
  border: 1px solid #2d3748;
  border-radius: 12px;
  width: 280px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  transition: border-color 0.15s;
}

.card:hover {
  border-color: #68d391;
}

.card-top {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.scenario-id {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #4a5568;
}

h2 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0;
}

.stats {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.stats li {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 0.875rem;
}

.stat-label {
  color: #718096;
}

.stat-value {
  font-weight: 600;
  color: #e2e8f0;
}

.stat-value.savings { color: #68d391; }
.stat-value.pay     { color: #63b3ed; }

.play-btn {
  margin-top: auto;
  padding: 0.6rem 1rem;
  background: #68d391;
  color: #1a1a2e;
  border: none;
  border-radius: 7px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
  width: 100%;
}

.play-btn:hover {
  background: #48bb78;
}
</style>
