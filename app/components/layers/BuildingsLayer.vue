<script setup lang="ts">
import Konva from 'konva'
import { locations, toPixels } from '~/data/locations'
import { TILE_SIZE } from '~/types/simulation'

const INTERACTION_PADDING = TILE_SIZE

const layerRef = ref<{ getNode(): Konva.Layer } | null>(null)

const buildingShapes = computed(() =>
  locations.map((b) => {
    const px = toPixels(b)
    return {
      id: b.id,
      name: b.name,
      color: b.color,
      rect: { ...px, fill: b.color, cornerRadius: 4, listening: false, perfectDrawEnabled: false },
      label: {
        x: px.x + px.width / 2,
        y: px.y + px.height / 2 - 8,
        text: b.name,
        fontSize: 13,
        fontFamily: 'system-ui, sans-serif',
        fontStyle: 'bold',
        fill: '#ffffff',
        align: 'center' as const,
        offsetX: 60,
        width: 120,
        listening: false,
      },
      zone: {
        x: px.x - INTERACTION_PADDING,
        y: px.y - INTERACTION_PADDING,
        width: px.width + INTERACTION_PADDING * 2,
        height: px.height + INTERACTION_PADDING * 2,
        stroke: b.color,
        strokeWidth: 1,
        dash: [6, 4],
        fill: 'transparent',
        opacity: 0.4,
        listening: false,
        perfectDrawEnabled: false,
      },
    }
  })
)

onMounted(() => {
  nextTick(() => {
    layerRef.value?.getNode().cache()
  })
})
</script>

<template>
  <v-layer ref="layerRef">
    <template v-for="b in buildingShapes" :key="b.id">
      <v-rect :config="b.rect" />
      <v-rect :config="b.zone" />
      <v-text :config="b.label" />
    </template>
  </v-layer>
</template>
