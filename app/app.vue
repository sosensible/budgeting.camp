<script setup lang="ts">
useHead({
  title: 'Life Simulator',
  style: [{ children: 'html, body { margin: 0; padding: 0; overflow: hidden; background: #1a1a2e; }' }],
})
</script>

<template>
  <ClientOnly>
    <GameStage />
  </ClientOnly>
</template>
