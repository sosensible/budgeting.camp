<script setup lang="ts">
import Konva from 'konva'

const stageRef = ref<{ getNode(): Konva.Stage } | null>(null)

const stageConfig = computed(() => ({
  width: window.innerWidth,
  height: window.innerHeight,
}))

onMounted(() => {
  const container = stageRef.value?.getNode().container()
  if (container) {
    container.tabIndex = 1
    container.focus()
  }
})
</script>

<template>
  <v-stage ref="stageRef" :config="stageConfig">
    <v-layer>
      <!-- layers will be added here in subsequent phases -->
    </v-layer>
  </v-stage>
</template>
