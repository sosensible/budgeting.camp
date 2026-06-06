<script setup lang="ts">
useHead({
  style: [{ innerHTML: 'html, body { margin: 0; padding: 0; overflow: hidden; background: #1a1a2e; }' }],
})

const started = ref(false)
</script>

<template>
  <WelcomeScreen v-if="!started" @start="started = true" />
  <ClientOnly v-else>
    <GameStage />
  </ClientOnly>
</template>
