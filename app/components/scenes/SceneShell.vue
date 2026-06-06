<script setup lang="ts">
defineProps<{ title: string }>()

const world = useWorldStore()
</script>

<template>
  <div class="scene">
    <div class="scene-card">
      <div class="scene-header">
        <h2>{{ title }}</h2>
        <button class="leave-btn" @click="world.leaveLocation()">Leave</button>
      </div>
      <div class="scene-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.scene {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.82);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  font-family: system-ui, sans-serif;
}

.scene-card {
  background: #1e2a3a;
  border: 1px solid #2d3748;
  border-radius: 12px;
  width: min(640px, 90vw);
  max-height: 80vh;
  overflow-y: auto;
  color: #e2e8f0;
}

.scene-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #2d3748;
}

h2 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.leave-btn {
  padding: 0.4rem 1rem;
  background: transparent;
  border: 1px solid #4a5568;
  border-radius: 6px;
  color: #a0aec0;
  font-size: 0.85rem;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}

.leave-btn:hover {
  border-color: #68d391;
  color: #68d391;
}

.scene-body {
  padding: 1.5rem;
}
</style>
