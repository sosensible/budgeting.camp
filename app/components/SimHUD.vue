<script setup lang="ts">
defineEmits<{ exit: [] }>()

const world    = useWorldStore()
const finance  = useFinanceStore()
const simTime  = useSimTimeStore()
const scenario = useScenarioStore()

const nearbyName = computed(() => {
  if (!world.nearbyLocation) return null
  return scenario.buildings.find(l => l.id === world.nearbyLocation)?.name ?? null
})
</script>

<template>
  <div class="hud-left">
    <img v-if="scenario.data.avatar" :src="scenario.data.avatar" alt="Player avatar" class="hud-avatar">
    <div class="hud-balance">
      <span class="label">Checking</span>
      <span class="amount">${{ finance.checking.toFixed(2) }}</span>
    </div>
  </div>

  <div class="hud-time">
    Day {{ simTime.day }} · {{ simTime.dayName }} · {{ simTime.timeDisplay }}
    <button class="exit-btn" @click="$emit('exit')">Exit</button>
  </div>

  <div v-if="nearbyName" class="hud-prompt">
    {{ nearbyName }}
  </div>
</template>

<style scoped>
.hud-left {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 10px;
}

.hud-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

.hud-balance {
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
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.exit-btn {
  background: transparent;
  border: 1px solid #4a5568;
  border-radius: 4px;
  color: #718096;
  font-size: 0.75rem;
  padding: 0.15rem 0.5rem;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  pointer-events: all;
}

.exit-btn:hover {
  border-color: #fc8181;
  color: #fc8181;
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
</style>
