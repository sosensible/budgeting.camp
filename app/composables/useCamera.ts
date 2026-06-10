export function useCamera() {
  const stageX = ref(0)
  const stageY = ref(0)
  const camera = useCameraStore()

  function update(residentX: number, residentY: number, vpW: number, vpH: number) {
    const { tileSize, cols, rows } = useScenarioStore().world
    const worldW = cols * tileSize
    const worldH = rows * tileSize
    stageX.value = Math.round(Math.min(0, Math.max(-(worldW - vpW), -(residentX - vpW / 2))))
    stageY.value = Math.round(Math.min(0, Math.max(-(worldH - vpH), -(residentY - vpH / 2))))
    camera.set(-stageX.value, -stageY.value, vpW, vpH)
  }

  return { stageX, stageY, update }
}
