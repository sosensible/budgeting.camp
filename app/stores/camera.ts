// Visible world rect, updated by useCamera each frame. Layers use it to cull
// off-screen content (background chunks, buildings) on large maps.
export const useCameraStore = defineStore('camera', () => {
  const viewX = ref(0)
  const viewY = ref(0)
  const viewW = ref(0)
  const viewH = ref(0)

  function set(x: number, y: number, w: number, h: number) {
    viewX.value = x
    viewY.value = y
    viewW.value = w
    viewH.value = h
  }

  return { viewX, viewY, viewW, viewH, set }
})
