<script setup lang="ts">
import { toPixels, doorPixels } from '~/data/locations'

const DOOR_COLOR = '#6b4226'

const scenario = useScenarioStore()
const camera = useCameraStore()

// margin covers sprite overhang above footprints and labels below
const CULL_MARGIN_PX = 6 * 48

const visibleBuildings = computed(() => {
  if (!camera.viewW) return scenario.buildings  // before first camera frame
  const x0 = camera.viewX - CULL_MARGIN_PX
  const y0 = camera.viewY - CULL_MARGIN_PX
  const x1 = camera.viewX + camera.viewW + CULL_MARGIN_PX
  const y1 = camera.viewY + camera.viewH + CULL_MARGIN_PX
  return scenario.buildings.filter((b) => {
    const px = toPixels(b)
    return px.x + px.width >= x0 && px.x <= x1 && px.y + px.height >= y0 && px.y <= y1
  })
})

// src -> loaded element; reactive so shapes refresh as sprites arrive
const imageCache = reactive<Record<string, HTMLImageElement | null>>({})

watch(() => scenario.buildings, (buildings) => {
  if (!import.meta.client) return
  for (const b of buildings) {
    if (!b.image || b.image in imageCache) continue
    imageCache[b.image] = null
    const img = new Image()
    const src = b.image
    img.onload = () => { imageCache[src] = img }
    img.src = src
  }
}, { immediate: true })

const buildingShapes = computed(() =>
  visibleBuildings.value.map((b) => {
    const px = toPixels(b)
    const dp = doorPixels(b)
    const sprite = b.image ? imageCache[b.image] : null

    // sprite spans the footprint width with a slight overhang, keeps its
    // aspect ratio, and sits bottom-aligned on the footprint
    let image = null
    if (sprite) {
      const width = px.width * 1.12
      const height = width * (sprite.height / sprite.width)
      image = {
        image: sprite,
        x: px.x + (px.width - width) / 2,
        y: px.y + px.height - height,
        width,
        height,
        listening: false,
        perfectDrawEnabled: false,
      }
    }

    return {
      id: b.id,
      image,
      rect: { ...px, fill: b.color, cornerRadius: 4, listening: false, perfectDrawEnabled: false },
      door: { ...dp, fill: DOOR_COLOR, opacity: image ? 0.85 : 1, listening: false, perfectDrawEnabled: false },
      label: {
        x: px.x + px.width / 2,
        y: image ? px.y + px.height + 6 : px.y + px.height / 2 - 8,
        text: b.name,
        fontSize: 13,
        fontFamily: 'system-ui, sans-serif',
        fontStyle: 'bold',
        fill: '#ffffff',
        align: 'center' as const,
        offsetX: 60,
        width: 120,
        shadowColor: '#000000',
        shadowBlur: 4,
        shadowOpacity: 0.7,
        listening: false,
      },
    }
  })
)
</script>

<template>
  <v-layer>
    <template v-for="b in buildingShapes" :key="b.id">
      <v-image v-if="b.image" :config="b.image" />
      <v-rect v-else :config="b.rect" />
      <v-rect :config="b.door" />
      <v-text :config="b.label" />
    </template>
  </v-layer>
</template>
