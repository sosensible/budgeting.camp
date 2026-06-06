<script setup lang="ts">
const world = useWorldStore()

const sceneMap: Record<string, ReturnType<typeof resolveComponent>> = {
  'home':            resolveComponent('HomeScene'),
  'workplace':       resolveComponent('WorkScene'),
  'bank':            resolveComponent('BankScene'),
  'general-store':   resolveComponent('GeneralStoreScene'),
  'clothing-store':  resolveComponent('ClothingStoreScene'),
}
</script>

<template>
  <ClientOnly>
    <SimulatorStage />
    <SimHUD />
    <component :is="sceneMap[world.currentScene]" v-if="world.currentScene !== 'overworld'" />
  </ClientOnly>
</template>
