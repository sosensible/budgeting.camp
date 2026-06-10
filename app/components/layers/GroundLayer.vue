<script setup lang="ts">
import { TILE_SIZE } from '~/types/simulation'

const TILE_COLORS: Record<number, string> = {
  0: '#5a8a3c',
  1: '#c8b87a',
  2: '#4a90d9',
  3: '#5a8a3c',
}

const scenario = useScenarioStore()

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

const tiles = computed(() => {
  if (scenario.background) return []
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
    <v-rect v-for="t in tiles" :key="t.key" :config="t" />
  </v-layer>
</template>
