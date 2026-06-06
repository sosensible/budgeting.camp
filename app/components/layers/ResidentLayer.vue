<script setup lang="ts">
const resident = useResidentStore()

const config = computed(() => ({
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
    <v-rect :config="config" />
  </v-layer>
</template>
