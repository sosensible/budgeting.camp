<script setup lang="ts">
const locationName = useLocationName('General Store')
import type { ScenarioStoreItem } from '~/stores/scenario'

const finance  = useFinanceStore()
const simTime  = useSimTimeStore()
const scenario = useScenarioStore()

const generalStoreItems = computed(() => scenario.data.stores['general-store'] ?? [])
type StoreItem = ScenarioStoreItem
const flashId = ref<string | null>(null)
const flashType = ref<'success' | 'error'>('success')

function buy(item: StoreItem) {
  const ok = finance.debit(item.price, item.name, 'groceries', simTime.day)
  flashId.value = item.id
  flashType.value = ok ? 'success' : 'error'
  setTimeout(() => { flashId.value = null }, 1800)
}
</script>

<template>
  <SceneShell :title="locationName">
    <div class="balance-bar">
      Checking: <strong>\${{ finance.checking.toFixed(2) }}</strong>
    </div>

    <ul class="item-list">
      <li v-for="item in generalStoreItems" :key="item.id" class="item-row">
        <div class="item-info">
          <span class="item-name">{{ item.name }}</span>
          <span class="item-desc">{{ item.description }}</span>
        </div>
        <div class="item-right">
          <span class="item-price">\${{ item.price.toFixed(2) }}</span>
          <button class="buy-btn" @click="buy(item)">Buy</button>
        </div>
        <div v-if="flashId === item.id" :class="['flash', flashType]">
          {{ flashType === 'success' ? 'Purchased!' : 'Insufficient funds' }}
        </div>
      </li>
    </ul>
  </SceneShell>
</template>

<style scoped>
.balance-bar {
  font-size: 0.85rem;
  color: #a0aec0;
  margin-bottom: 1rem;
}

.balance-bar strong { color: #68d391; }

.item-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-row {
  background: #2d3748;
  border-radius: 6px;
  padding: 0.65rem 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-name { font-size: 0.95rem; color: #e2e8f0; font-weight: 500; }
.item-desc { font-size: 0.78rem; color: #718096; }

.item-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.item-price { font-size: 0.95rem; color: #e2e8f0; font-weight: 600; min-width: 4rem; text-align: right; }

.buy-btn {
  padding: 0.3rem 0.85rem;
  background: #2b6cb0;
  color: #bee3f8;
  border: none;
  border-radius: 5px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s;
}

.buy-btn:hover { background: #3182ce; }

.flash {
  position: absolute;
  right: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 4px;
  padding: 0.2rem 0.6rem;
  pointer-events: none;
}

.flash.success { background: #1a3a2a; color: #68d391; }
.flash.error   { background: #3a1a1a; color: #fc8181; }
</style>
