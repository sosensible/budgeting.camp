<script setup lang="ts">
import { locations } from '~/data/locations'

const world = useWorldStore()
const finance = useFinanceStore()
const simTime = useSimTimeStore()

const nearbyName = computed(() => {
  if (!world.nearbyLocation) return null
  return locations.find(l => l.id === world.nearbyLocation)?.name ?? null
})
</script>

<template>
  <div class="hud-balance">
    <span class="label">Checking</span>
    <span class="amount">${{ finance.checking.toFixed(2) }}</span>
  </div>

  <div class="hud-time">
    Day {{ simTime.day }} · {{ simTime.dayName }} · {{ simTime.timeDisplay }}
  </div>

  <div v-if="nearbyName" class="hud-prompt">
    Press <kbd>E</kbd> to enter {{ nearbyName }}
  </div>
</template>

<style scoped>
.hud-balance {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 20;
  background: rgba(0, 0, 0, 0.65);
  color: #e2e8f0;
  font-family: system-ui, sans-serif;
  font-size: 0.9rem;
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.hud-balance .label {
  font-size: 0.7rem;
  color: #a0aec0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.hud-balance .amount {
  font-size: 1rem;
  font-weight: 600;
  color: #68d391;
}

.hud-time {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 20;
  background: rgba(0, 0, 0, 0.65);
  color: #e2e8f0;
  font-family: system-ui, sans-serif;
  font-size: 0.85rem;
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  pointer-events: none;
}

.hud-prompt {
  position: fixed;
  bottom: 48px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.65);
  color: #e2e8f0;
  font-family: system-ui, sans-serif;
  font-size: 0.95rem;
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  pointer-events: none;
  white-space: nowrap;
}

kbd {
  background: #4a5568;
  border-radius: 3px;
  padding: 0.1em 0.4em;
  font-size: 0.85em;
  font-family: inherit;
}
</style>
