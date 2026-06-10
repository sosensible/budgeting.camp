export const useWorldStore = defineStore('world', () => {
  const nearbyLocation = ref<string | null>(null)
  const currentScene = ref<string>('overworld')
  const exitLocked = ref(false)  // prevents re-entry until resident walks away from the door

  function enterLocation(sceneId: string) {
    currentScene.value = sceneId
  }

  function leaveLocation() {
    currentScene.value = 'overworld'
    exitLocked.value = true
  }

  function reset() {
    currentScene.value  = 'overworld'
    nearbyLocation.value = null
    exitLocked.value    = false
  }

  return { nearbyLocation, currentScene, exitLocked, enterLocation, leaveLocation, reset }
})
