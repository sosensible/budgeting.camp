export interface Transaction {
  id: string
  simDay: number
  description: string
  category: 'income' | 'groceries' | 'clothing' | 'transfer'
  amount: number  // positive = credit, negative = debit
}

export const useFinanceStore = defineStore('finance', () => {
  const checking = ref(1850)
  const savings = ref(320)
  const transactions = ref<Transaction[]>([])
  const lastPaydayDay = ref(-7)  // available from Day 1

  function credit(amount: number, description: string, category: Transaction['category'], simDay: number) {
    checking.value = Math.round((checking.value + amount) * 100) / 100
    transactions.value.unshift({ id: crypto.randomUUID(), simDay, description, category, amount })
  }

  function debit(amount: number, description: string, category: Transaction['category'], simDay: number): boolean {
    if (checking.value < amount) return false
    checking.value = Math.round((checking.value - amount) * 100) / 100
    transactions.value.unshift({ id: crypto.randomUUID(), simDay, description, category, amount: -amount })
    return true
  }

  function canCollectPaycheck(currentDay: number): boolean {
    return currentDay - lastPaydayDay.value >= 7
  }

  function collectPaycheck(simDay: number): boolean {
    if (!canCollectPaycheck(simDay)) return false
    credit(1200, 'Weekly paycheck', 'income', simDay)
    lastPaydayDay.value = simDay
    return true
  }

  function transferToSavings(amount: number, simDay: number): boolean {
    if (amount <= 0 || checking.value < amount) return false
    checking.value = Math.round((checking.value - amount) * 100) / 100
    savings.value = Math.round((savings.value + amount) * 100) / 100
    transactions.value.unshift({
      id: crypto.randomUUID(), simDay,
      description: `Transfer to savings`,
      category: 'transfer',
      amount: -amount,
    })
    return true
  }

  return { checking, savings, transactions, lastPaydayDay, canCollectPaycheck, collectPaycheck, debit, transferToSavings }
})
