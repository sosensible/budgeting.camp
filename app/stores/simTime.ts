import type { ScenarioSimTime } from '~/stores/scenario'

export const useSimTimeStore = defineStore('simTime', () => {
  const simMinutesPerRealSecond = ref(15)
  const totalMinutes = ref(0)

  function init(config: ScenarioSimTime) {
    simMinutesPerRealSecond.value = config.simMinutesPerRealSecond
    totalMinutes.value = config.startHour * 60 + config.startMinute
  }

  const day       = computed(() => Math.floor(totalMinutes.value / (24 * 60)) + 1)
  const hour      = computed(() => Math.floor((totalMinutes.value % (24 * 60)) / 60))
  const minute    = computed(() => Math.floor(totalMinutes.value % 60))
  const dayOfWeek = computed(() => (day.value - 1) % 7)
  const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const dayName   = computed(() => DAY_NAMES[dayOfWeek.value])

  const timeDisplay = computed(() => {
    const h    = hour.value
    const m    = minute.value
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12  = h % 12 || 12
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
  })

  function tick(deltaMs: number) {
    totalMinutes.value += (deltaMs / 1000) * simMinutesPerRealSecond.value
  }

  return { day, hour, minute, dayOfWeek, dayName, timeDisplay, tick, init }
})
