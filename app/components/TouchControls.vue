<script setup lang="ts">
// Virtual joystick for touch devices. Drives the same input flags as the
// keyboard, so movement, collision, and door entry are unchanged.
const input = useInputStore()
const route = useRoute()

const BASE_R = 60      // joystick base radius (px)
const KNOB_R = 28
const DEADZONE = 12
const AXIS_THRESHOLD = 0.38  // normalized component needed to engage an axis (8-way)

const visible = ref(false)
onMounted(() => {
  visible.value = window.matchMedia('(pointer: coarse)').matches || route.query.touch === '1'
})

const active = ref(false)
const knobX = ref(0)
const knobY = ref(0)

const baseEl = ref<HTMLElement | null>(null)

function setFromOffset(dx: number, dy: number) {
  const dist = Math.hypot(dx, dy)
  const maxTravel = BASE_R - KNOB_R / 2
  // clamp knob inside the base ring
  const clamp = Math.min(dist, maxTravel)
  if (dist > 0) {
    knobX.value = (dx / dist) * clamp
    knobY.value = (dy / dist) * clamp
  }
  if (dist < DEADZONE) {
    input.clearMovement()
    return
  }
  const nx = dx / dist
  const ny = dy / dist
  input.keys.right = nx > AXIS_THRESHOLD
  input.keys.left  = nx < -AXIS_THRESHOLD
  input.keys.down  = ny > AXIS_THRESHOLD
  input.keys.up    = ny < -AXIS_THRESHOLD
  // analog speed: nudge = slow walk, full deflection = full speed
  const push = Math.min(1, (dist - DEADZONE) / (maxTravel - DEADZONE))
  input.throttle = 0.35 + 0.65 * push
}

function onPointerDown(e: PointerEvent) {
  active.value = true
  baseEl.value?.setPointerCapture(e.pointerId)
  onPointerMove(e)
}

function onPointerMove(e: PointerEvent) {
  if (!active.value || !baseEl.value) return
  const rect = baseEl.value.getBoundingClientRect()
  setFromOffset(
    e.clientX - (rect.left + rect.width / 2),
    e.clientY - (rect.top + rect.height / 2),
  )
}

function onPointerUp() {
  active.value = false
  knobX.value = 0
  knobY.value = 0
  input.clearMovement()
}

onUnmounted(() => input.clearMovement())
</script>

<template>
  <div
    v-if="visible"
    ref="baseEl"
    class="joystick"
    @pointerdown.prevent="onPointerDown"
    @pointermove.prevent="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <div
      class="knob"
      :class="{ active }"
      :style="{ transform: `translate(${knobX}px, ${knobY}px)` }"
    />
  </div>
</template>

<style scoped>
.joystick {
  position: fixed;
  left: 28px;
  bottom: 28px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.25);
  border: 2px solid rgba(255, 255, 255, 0.35);
  z-index: 25;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.knob {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.55);
  border: 2px solid rgba(255, 255, 255, 0.8);
  transition: transform 0.05s linear;
}

.knob.active {
  background: rgba(255, 255, 255, 0.75);
}
</style>
