export const useSimTimeStore = defineStore('simTime', () => {
  // 15 sim-minutes per real second → 1 sim day ≈ 96 real seconds
  const SIM_MINUTES_PER_REAL_SECOND = 15

  const totalMinutes = ref(8 * 60)  // Day 1, 8:00 AM

  const day = computed(() => Math.floor(totalMinutes.value / (24 * 60)) + 1)
  const hour = computed(() => Math.floor((totalMinutes.value % (24 * 60)) / 60))
  const minute = computed(() => Math.floor(totalMinutes.value % 60))
  const dayOfWeek = computed(() => (day.value - 1) % 7)  // 0=Mon … 6=Sun
  const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const dayName = computed(() => DAY_NAMES[dayOfWeek.value])

  const timeDisplay = computed(() => {
    const h = hour.value
    const m = minute.value
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
  })

  function tick(deltaMs: number) {
    totalMinutes.value += (deltaMs / 1000) * SIM_MINUTES_PER_REAL_SECOND
  }

  return { day, hour, minute, dayOfWeek, dayName, timeDisplay, tick }
})
