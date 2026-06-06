<script setup lang="ts">
import { worldMap } from '~/data/worldMap'
import { TILE_SIZE } from '~/types/simulation'

const TILE_COLORS: Record<number, string> = {
  0: '#5a8a3c', // grass
  1: '#c8b87a', // path
  2: '#4a90d9', // water
  3: '#5a8a3c', // wall (same as grass — buildings sit on top)
}

const tiles = computed(() =>
  worldMap.flatMap((row, r) =>
    row.map((tile, c) => ({
      key: `${r}-${c}`,
      x: c * TILE_SIZE,
      y: r * TILE_SIZE,
      width: TILE_SIZE,
      height: TILE_SIZE,
      fill: TILE_COLORS[tile],
      strokeWidth: 0,
      listening: false,
      perfectDrawEnabled: false,
    }))
  )
)

</script>

<template>
  <v-layer>
    <v-rect v-for="t in tiles" :key="t.key" :config="t" />
  </v-layer>
</template>
