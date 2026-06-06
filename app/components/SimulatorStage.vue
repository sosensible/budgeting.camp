<script setup lang="ts">
import Konva from 'konva'

const stageRef = ref<{ getNode(): Konva.Stage } | null>(null)
const vpW = ref(window.innerWidth)
const vpH = ref(window.innerHeight)

const { keys } = useKeyboard()
const { update: moveResident } = useResident(keys)
const { stageX, stageY, update: moveCamera } = useCamera()
const resident = useResidentStore()

const stageConfig = computed(() => ({
  width: vpW.value,
  height: vpH.value,
  x: stageX.value,
  y: stageY.value,
}))

useSimLoop(() => {
  moveResident()
  moveCamera(resident.x, resident.y, vpW.value, vpH.value)
})

onMounted(() => {
  const container = stageRef.value?.getNode().container()
  if (container) { container.tabIndex = 1; container.focus() }
})
</script>

<template>
  <v-stage ref="stageRef" :config="stageConfig">
    <GroundLayer />
    <BuildingsLayer />
    <ResidentLayer />
  </v-stage>
</template>
