<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <ScenarioSelect @select="id => router.push(`/simulator?id=${id}`)" />
</template>
