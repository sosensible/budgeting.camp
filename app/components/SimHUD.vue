<script setup lang="ts">
import { locations } from '~/data/locations'

const world = useWorldStore()

const nearbyName = computed(() => {
  if (!world.nearbyLocation) return null
  return locations.find(l => l.id === world.nearbyLocation)?.name ?? null
})
</script>

<template>
  <div v-if="nearbyName" class="hud-prompt">
    Press <kbd>E</kbd> to enter {{ nearbyName }}
  </div>
</template>

<style scoped>
.hud-prompt {
  position: fixed;
  bottom: 48px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.65);
  color: #e2e8f0;
  font-family: system-ui, sans-serif;
  font-size: 0.95rem;
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  pointer-events: none;
  white-space: nowrap;
}

kbd {
  background: #4a5568;
  border-radius: 3px;
  padding: 0.1em 0.4em;
  font-size: 0.85em;
  font-family: inherit;
}
</style>
