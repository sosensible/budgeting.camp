<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <WelcomeScreen @start="router.push('/simulator')" />
</template>
