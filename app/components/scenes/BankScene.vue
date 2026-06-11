<script setup lang="ts">
const locationName = useLocationName('Bank')
const finance = useFinanceStore()
const simTime = useSimTimeStore()

const transferInput = ref('')
const transferMsg = ref('')
const transferOk = ref(false)

function doTransfer() {
  const amount = parseFloat(transferInput.value)
  if (!Number.isFinite(amount) || amount <= 0) {
    transferMsg.value = 'Enter a valid amount greater than zero.'
    transferOk.value = false
    return
  }
  if (!finance.transferToSavings(amount, simTime.day)) {
    transferMsg.value = 'Insufficient funds in checking.'
    transferOk.value = false
    return
  }
  transferMsg.value = `\$${amount.toFixed(2)} moved to savings.`
  transferOk.value = true
  transferInput.value = ''
  setTimeout(() => { transferMsg.value = '' }, 3000)
}

function txSign(amount: number) { return amount >= 0 ? '+' : '' }
function txClass(amount: number) { return amount >= 0 ? 'credit' : 'debit' }
</script>

<template>
  <SceneShell :title="locationName">
    <div class="accounts">
      <div class="account">
        <span class="acct-label">Checking</span>
        <span class="acct-balance">\${{ finance.checking.toFixed(2) }}</span>
      </div>
      <div class="account">
        <span class="acct-label">Savings</span>
        <span class="acct-balance savings">\${{ finance.savings.toFixed(2) }}</span>
      </div>
    </div>

    <div class="transfer-section">
      <label class="transfer-label">Transfer to Savings</label>
      <div class="transfer-row">
        <input
          v-model="transferInput"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Amount"
          class="transfer-input"
          @keyup.enter="doTransfer"
        />
        <button class="transfer-btn" @click="doTransfer">Transfer</button>
      </div>
      <p v-if="transferMsg" :class="['transfer-msg', transferOk ? 'ok' : 'err']">
        {{ transferMsg }}
      </p>
    </div>

    <div class="tx-section">
      <h3 class="tx-title">Transaction History</h3>
      <p v-if="!finance.transactions.length" class="tx-empty">No transactions yet.</p>
      <ul v-else class="tx-list">
        <li
          v-for="tx in finance.transactions.slice(0, 25)"
          :key="tx.id"
          class="tx-row"
        >
          <span class="tx-day">Day {{ tx.simDay }}</span>
          <span class="tx-desc">{{ tx.description }}</span>
          <span :class="['tx-amount', txClass(tx.amount)]">
            {{ txSign(tx.amount) }}\${{ Math.abs(tx.amount).toFixed(2) }}
          </span>
        </li>
      </ul>
    </div>
  </SceneShell>
</template>

<style scoped>
.accounts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.account {
  background: #2d3748;
  border-radius: 8px;
  padding: 0.9rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.acct-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #718096;
}

.acct-balance {
  font-size: 1.3rem;
  font-weight: 700;
  color: #e2e8f0;
}

.acct-balance.savings { color: #68d391; }

.transfer-section {
  margin-bottom: 1.5rem;
}

.transfer-label {
  display: block;
  font-size: 0.8rem;
  color: #a0aec0;
  margin-bottom: 0.4rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.transfer-row {
  display: flex;
  gap: 0.5rem;
}

.transfer-input {
  flex: 1;
  background: #2d3748;
  border: 1px solid #4a5568;
  border-radius: 6px;
  color: #e2e8f0;
  font-size: 0.9rem;
  padding: 0.45rem 0.75rem;
  outline: none;
}

.transfer-input:focus { border-color: #63b3ed; }

.transfer-btn {
  padding: 0.45rem 1.1rem;
  background: #2b6cb0;
  color: #bee3f8;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.15s;
}

.transfer-btn:hover { background: #3182ce; }

.transfer-msg {
  margin: 0.4rem 0 0;
  font-size: 0.82rem;
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
}

.transfer-msg.ok { background: #1a3a2a; color: #68d391; }
.transfer-msg.err { background: #3a1a1a; color: #fc8181; }

.tx-section { margin-top: 0.5rem; }

.tx-title {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #718096;
  margin: 0 0 0.5rem;
}

.tx-empty { color: #4a5568; font-style: italic; font-size: 0.85rem; }

.tx-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tx-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
}

.tx-row:nth-child(odd) { background: #1a202c; }

.tx-day { color: #718096; min-width: 3.5rem; }
.tx-desc { flex: 1; color: #cbd5e0; }
.tx-amount { font-weight: 600; min-width: 5rem; text-align: right; }
.tx-amount.credit { color: #68d391; }
.tx-amount.debit  { color: #fc8181; }
</style>
