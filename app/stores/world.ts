export const useWorldStore = defineStore('world', () => {
  const nearbyLocation = ref<string | null>(null)
  const currentScene = ref<string>('overworld')

  function enterLocation() {
    if (nearbyLocation.value) currentScene.value = nearbyLocation.value
  }

  function leaveLocation() {
    currentScene.value = 'overworld'
  }

  return { nearbyLocation, currentScene, enterLocation, leaveLocation }
})
