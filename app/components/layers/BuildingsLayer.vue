<script setup lang="ts">
import { toPixels, doorPixels, doorTileRects, doorInsetFor, doorOutwardDirFor } from '~/data/locations'
import type { TileRect } from '~/data/locations'
import type { Building } from '~/types/simulation'

const DOOR_COLOR = '#6b4226'
const GLOW_RADIUS = 56

// halo anchored on the door rect, biased toward the approach side: the
// radial gradient's end circle is displaced outward, so the glow hugs the
// door and stretches in the approach direction
function doorGlow(b: Building, doorRect: TileRect, out: [number, number]) {
  const R = GLOW_RADIUS
  return {
    x: doorRect.x + doorRect.width / 2,
    y: doorRect.y + doorRect.height / 2,
    radius: R,
    offsetX: -out[0] * R * 0.45,  // shape center shifted toward the approach
    offsetY: -out[1] * R * 0.45,
    fillRadialGradientStartRadius: 0,
    fillRadialGradientEndRadius: R,
    fillRadialGradientColorStops: [0, 'rgba(255,255,255,0.75)', 0.5, 'rgba(255,255,255,0.35)', 1, 'rgba(255,255,255,0)'],
    listening: false,
    perfectDrawEnabled: false,
  }
}

const scenario = useScenarioStore()
const camera = useCameraStore()
const input = useInputStore()

// door halo visibility: touch devices show them while moving; desktop
// hides them until toggled with Ctrl+F
const isTouch = ref(false)
onMounted(() => { isTouch.value = window.matchMedia('(pointer: coarse)').matches })

const moving = computed(() =>
  input.keys.up || input.keys.down || input.keys.left || input.keys.right)

const showDoorGlows = computed(() =>
  isTouch.value ? moving.value : input.showDoorHints)

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
    const sprite = b.image ? imageCache[b.image] : null

    // carved doorways show only the approach-side glow; legacy buildings
    // keep their simple door rect
    const doors = b.doorway
      ? doorTileRects(b).map((t) => ({
          rect: null as Record<string, unknown> | null,
          glow: doorGlow(b, doorInsetFor(b, t), doorOutwardDirFor(b, t)),
        }))
      : [{
          rect: { ...doorPixels(b), fill: DOOR_COLOR, opacity: sprite ? 0.85 : 1, listening: false, perfectDrawEnabled: false } as Record<string, unknown> | null,
          glow: null as ReturnType<typeof doorGlow> | null,
        }]

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
      doors,
      label: {
        x: px.x + px.width / 2,
        // doorway buildings: clear the door halo below the south edge
        y: b.doorway ? px.y + px.height + GLOW_RADIUS + 12
          : image ? px.y + px.height + 6
          : px.y + px.height / 2 - 8,
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
      <template v-for="(d, i) in b.doors" :key="`${b.id}-door-${i}`">
        <v-circle v-if="d.glow && showDoorGlows" :config="d.glow" />
        <v-rect v-if="d.rect" :config="d.rect" />
      </template>
      <v-text :config="b.label" />
    </template>
  </v-layer>
</template>
