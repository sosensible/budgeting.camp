<script setup lang="ts">
const resident = useResidentStore()

// 8-direction walk cycle sheet: rows = N,NE,E,SE,S,SW,W,NW; cols = 4 frames
const SHEET_CELL = 64
const SPRITE_SIZE = 56
const STRIDE_PX = 14          // world px travelled per animation frame
const IDLE_DELAY_MS = 120

const sheet = useKonvaImage(() => '/sprites/hiker.png')

const dirRow = ref(4)         // start facing south
const travelled = ref(0)
const moving = ref(false)
let lastX = resident.x
let lastY = resident.y
let idleTimer: ReturnType<typeof setTimeout> | null = null

watch(() => [resident.x, resident.y] as const, ([nx, ny]) => {
  const dx = nx - lastX
  const dy = ny - lastY
  lastX = nx
  lastY = ny
  if (!dx && !dy) return
  if (Math.hypot(dx, dy) > SPRITE_SIZE) return  // teleport (spawn/scenario load), don't animate
  travelled.value += Math.hypot(dx, dy)
  const angle = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360  // clockwise from north
  dirRow.value = Math.round(angle / 45) % 8
  moving.value = true
  if (idleTimer) clearTimeout(idleTimer)
  idleTimer = setTimeout(() => { moving.value = false }, IDLE_DELAY_MS)
})

onUnmounted(() => { if (idleTimer) clearTimeout(idleTimer) })

const frame = computed(() =>
  moving.value ? Math.floor(travelled.value / STRIDE_PX) % 4 : 0
)

const spriteConfig = computed(() => ({
  image: sheet.value,
  x: resident.x,
  y: resident.y,
  width: SPRITE_SIZE,
  height: SPRITE_SIZE,
  offsetX: SPRITE_SIZE / 2,
  offsetY: SPRITE_SIZE / 2,
  crop: {
    x: frame.value * SHEET_CELL,
    y: dirRow.value * SHEET_CELL,
    width: SHEET_CELL,
    height: SHEET_CELL,
  },
  listening: false,
  perfectDrawEnabled: false,
}))

// fallback square while the sheet loads
const fallbackConfig = computed(() => ({
  x: resident.x,
  y: resident.y,
  width: 28,
  height: 28,
  offsetX: 14,
  offsetY: 14,
  fill: '#f6e05e',
  stroke: '#d69e2e',
  strokeWidth: 2,
  cornerRadius: 4,
  listening: false,
}))
</script>

<template>
  <v-layer>
    <v-image v-if="sheet" :config="spriteConfig" />
    <v-rect v-else :config="fallbackConfig" />
  </v-layer>
</template>
