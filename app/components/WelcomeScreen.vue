<script setup lang="ts">
defineEmits<{ start: [] }>()
</script>

<template>
  <div class="welcome">
    <div class="card">
      <h1>Budgeting Camp</h1>
      <p class="tagline">A life simulation for practicing real financial decisions</p>
      <button @click="$emit('start')">Start Simulation</button>
    </div>
  </div>
</template>

<style scoped>
.welcome {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: #1a1a2e;
}

.card {
  text-align: center;
  color: #e2e8f0;
  font-family: system-ui, sans-serif;
}

h1 {
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: #68d391;
  letter-spacing: -0.02em;
}

.tagline {
  font-size: 1.1rem;
  color: #a0aec0;
  margin: 0 0 2.5rem;
}

button {
  padding: 0.75rem 2.5rem;
  font-size: 1rem;
  font-weight: 600;
  background: #68d391;
  color: #1a1a2e;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

button:hover {
  background: #48bb78;
}
</style>
