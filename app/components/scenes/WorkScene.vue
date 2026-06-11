<script setup lang="ts">
const locationName = useLocationName('Workplace')
const finance = useFinanceStore()
const simTime = useSimTimeStore()
const justCollected = ref(false)

const daysUntilPayday = computed(() => {
  const daysSincePay = simTime.day - finance.lastPaydayDay
  return Math.max(0, finance.paycheckCycleDays - daysSincePay)
})

const paycheckDisplay = computed(() =>
  `$${finance.paycheckAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
)

const canCollect = computed(() => finance.canCollectPaycheck(simTime.day))

function collect() {
  if (finance.collectPaycheck(simTime.day)) {
    justCollected.value = true
    setTimeout(() => { justCollected.value = false }, 3000)
  }
}
</script>

<template>
  <SceneShell :title="locationName">
    <div class="pay-info">
      <div class="stat">
        <span class="stat-label">Weekly Salary</span>
        <span class="stat-value">{{ paycheckDisplay }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Pay Period</span>
        <span class="stat-value">Weekly</span>
      </div>
      <div class="stat">
        <span class="stat-label">Checking Balance</span>
        <span class="stat-value">\${{ finance.checking.toFixed(2) }}</span>
      </div>
    </div>

    <div v-if="justCollected" class="notice success">
      Paycheck deposited — {{ paycheckDisplay }} added to checking.
    </div>
    <div v-else-if="canCollect" class="notice ready">
      Your paycheck is ready to collect.
    </div>
    <div v-else class="notice waiting">
      Next paycheck in {{ daysUntilPayday }} sim day{{ daysUntilPayday !== 1 ? 's' : '' }}.
    </div>

    <button class="collect-btn" :disabled="!canCollect" @click="collect">
      Collect Paycheck — {{ paycheckDisplay }}
    </button>
  </SceneShell>
</template>

<style scoped>
.pay-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat {
  background: #2d3748;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #718096;
}

.stat-value {
  font-size: 1.05rem;
  font-weight: 600;
  color: #e2e8f0;
}

.notice {
  border-radius: 6px;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.notice.success  { background: #1a3a2a; color: #68d391; border: 1px solid #276749; }
.notice.ready    { background: #1a2e40; color: #63b3ed; border: 1px solid #2b6cb0; }
.notice.waiting  { background: #2d3748; color: #a0aec0; border: 1px solid #4a5568; }

.collect-btn {
  display: block;
  width: 100%;
  padding: 0.65rem 1rem;
  background: #276749;
  color: #c6f6d5;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.collect-btn:hover:not(:disabled) { background: #2f855a; }

.collect-btn:disabled {
  background: #2d3748;
  color: #4a5568;
  cursor: not-allowed;
}
</style>
