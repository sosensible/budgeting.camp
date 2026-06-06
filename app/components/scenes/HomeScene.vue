<script setup lang="ts">
const finance = useFinanceStore()
const simTime = useSimTimeStore()

const netWorth = computed(() => finance.checking + finance.savings)

const recentSpend = computed(() => {
  return finance.transactions
    .filter(t => t.amount < 0 && t.category !== 'transfer')
    .slice(0, 5)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
})
</script>

<template>
  <SceneShell title="Home">
    <p class="tagline">Review your finances before heading out.</p>

    <div class="summary-grid">
      <div class="summary-card">
        <span class="card-label">Checking</span>
        <span class="card-value">\${{ finance.checking.toFixed(2) }}</span>
      </div>
      <div class="summary-card">
        <span class="card-label">Savings</span>
        <span class="card-value savings">\${{ finance.savings.toFixed(2) }}</span>
      </div>
      <div class="summary-card">
        <span class="card-label">Net Worth</span>
        <span class="card-value">\${{ netWorth.toFixed(2) }}</span>
      </div>
      <div class="summary-card">
        <span class="card-label">Recent Expenses</span>
        <span class="card-value expense">-\${{ recentSpend.toFixed(2) }}</span>
      </div>
    </div>

    <div class="tips">
      <h3 class="tips-title">Quick Tips</h3>
      <ul class="tips-list">
        <li>Visit the <strong>Workplace</strong> to collect your weekly paycheck.</li>
        <li>Stop at the <strong>General Store</strong> for groceries and essentials.</li>
        <li>Transfer extra funds to <strong>Savings</strong> at the Bank to build an emergency fund.</li>
        <li>Needs vs. wants: groceries help you survive; new clothes are optional.</li>
      </ul>
    </div>
  </SceneShell>
</template>

<style scoped>
.tagline {
  color: #a0aec0;
  font-size: 0.9rem;
  margin: 0 0 1.25rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.summary-card {
  background: #2d3748;
  border-radius: 8px;
  padding: 0.8rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.card-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #718096;
}

.card-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #e2e8f0;
}

.card-value.savings  { color: #68d391; }
.card-value.expense  { color: #fc8181; }

.tips-title {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #718096;
  margin: 0 0 0.5rem;
}

.tips-list {
  margin: 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  color: #cbd5e0;
  font-size: 0.88rem;
  line-height: 1.5;
}

.tips-list strong { color: #e2e8f0; }
</style>
