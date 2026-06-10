import type { ScenarioResident } from '~/stores/scenario'
import { TILE_SIZE } from '~/types/simulation'

export const useResidentStore = defineStore('resident', () => {
  const x     = ref(0)
  const y     = ref(0)
  const speed = ref(3)

  function init(config: ScenarioResident) {
    x.value     = config.spawnTileX * TILE_SIZE
    y.value     = config.spawnTileY * TILE_SIZE
    speed.value = config.speed
  }

  return { x, y, speed, init }
})
