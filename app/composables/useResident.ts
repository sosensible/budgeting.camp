import { canMoveTo } from '~/composables/useCollision'
import { locations, toPixels } from '~/data/locations'
import { TILE_SIZE } from '~/types/simulation'

const INTERACT_DISTANCE = TILE_SIZE * 1.5

export function useResident(keys: ReturnType<typeof useKeyboard>['keys']) {
  const resident = useResidentStore()
  const nearbyLocation = ref<string | null>(null)

  function update() {
    const { x, y, speed } = resident
    const s = speed.value
    let nx = x.value
    let ny = y.value

    if (keys.up)    ny -= s
    if (keys.down)  ny += s
    if (keys.left)  nx -= s
    if (keys.right) nx += s

    if (nx !== x.value && canMoveTo(nx, y.value)) x.value = nx
    if (ny !== y.value && canMoveTo(x.value, ny)) y.value = ny

    // detect nearby location entry zones
    nearbyLocation.value = null
    for (const loc of locations) {
      const px = toPixels(loc)
      const cx = px.x + px.width / 2
      const cy = px.y + px.height / 2
      const dx = x.value - cx
      const dy = y.value - cy
      if (Math.sqrt(dx * dx + dy * dy) < INTERACT_DISTANCE + px.width / 2) {
        nearbyLocation.value = loc.id
        break
      }
    }
  }

  return { update, nearbyLocation }
}
