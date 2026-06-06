import { TILE_SIZE } from '~/types/simulation'

export const useResidentStore = defineStore('resident', () => {
  const x = ref(5 * TILE_SIZE)
  const y = ref(9 * TILE_SIZE)
  const speed = ref(3)

  return { x, y, speed }
})
