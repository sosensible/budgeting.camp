<script setup lang="ts">
import { TILE_SIZE } from '~/types/simulation'

const TILE_COLORS: Record<number, string> = {
  0: '#5a8a3c',
  1: '#c8b87a',
  2: '#4a90d9',
  3: '#5a8a3c',
}

const CHUNK_MARGIN = 1  // extra ring of chunks pre-loaded around the viewport

const scenario = useScenarioStore()
const camera = useCameraStore()

const backgroundImage = useKonvaImage(() => scenario.background)

const backgroundConfig = computed(() => ({
  image: backgroundImage.value,
  x: 0,
  y: 0,
  width: scenario.world.cols * scenario.world.tileSize,
  height: scenario.world.rows * scenario.world.tileSize,
  listening: false,
  perfectDrawEnabled: false,
}))

// --- chunked background (large maps): render only chunks near the viewport ---
const chunkCache = reactive<Record<string, HTMLImageElement | null>>({})

function ensureChunk(src: string) {
  if (!import.meta.client || src in chunkCache) return
  chunkCache[src] = null
  const img = new Image()
  img.onload = () => { chunkCache[src] = img }
  img.src = src
}

const visibleChunks = computed(() => {
  const bc = scenario.backgroundChunks
  if (!bc || !camera.viewW) return []
  const c0 = Math.max(0, Math.floor(camera.viewX / bc.chunkW) - CHUNK_MARGIN)
  const c1 = Math.min(bc.cols - 1, Math.floor((camera.viewX + camera.viewW) / bc.chunkW) + CHUNK_MARGIN)
  const r0 = Math.max(0, Math.floor(camera.viewY / bc.chunkH) - CHUNK_MARGIN)
  const r1 = Math.min(bc.rows - 1, Math.floor((camera.viewY + camera.viewH) / bc.chunkH) + CHUNK_MARGIN)
  const out = []
  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) {
      const src = bc.urlPattern.replace('{r}', String(r)).replace('{c}', String(c))
      ensureChunk(src)
      const img = chunkCache[src]
      if (!img) continue
      out.push({
        key: `${r}-${c}`,
        config: {
          image: img,
          x: c * bc.chunkW,
          y: r * bc.chunkH,
          width: bc.chunkW,
          height: bc.chunkH,
          listening: false,
          perfectDrawEnabled: false,
        },
      })
    }
  }
  return out
})

// --- flat tile fallback (alpha-1/2): only when no image backdrop at all ---
const tiles = computed(() => {
  if (scenario.background || scenario.backgroundChunks) return []
  return scenario.tilemap.flatMap((row, r) =>
    row.map((tile, c) => ({
      key: `${r}-${c}`,
      x: c * TILE_SIZE,
      y: r * TILE_SIZE,
      width: TILE_SIZE,
      height: TILE_SIZE,
      fill: TILE_COLORS[tile as number],
      strokeWidth: 0,
      listening: false,
      perfectDrawEnabled: false,
    }))
  )
})
</script>

<template>
  <v-layer>
    <v-image v-if="scenario.background && backgroundImage" :config="backgroundConfig" />
    <v-image v-for="ch in visibleChunks" :key="ch.key" :config="ch.config" />
    <v-rect v-for="t in tiles" :key="t.key" :config="t" />
  </v-layer>
</template>
