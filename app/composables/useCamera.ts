import { WORLD_WIDTH, WORLD_HEIGHT } from '~/types/simulation'

export function useCamera() {
  const stageX = ref(0)
  const stageY = ref(0)

  function update(residentX: number, residentY: number, vpW: number, vpH: number) {
    stageX.value = Math.round(Math.min(0, Math.max(-(WORLD_WIDTH - vpW),  -(residentX - vpW / 2))))
    stageY.value = Math.round(Math.min(0, Math.max(-(WORLD_HEIGHT - vpH), -(residentY - vpH / 2))))
  }

  return { stageX, stageY, update }
}
