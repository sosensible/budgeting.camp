import { canMoveTo } from '~/composables/useCollision'
import { doorApproachPixels } from '~/data/locations'
import { TILE_SIZE } from '~/types/simulation'

const DOOR_NEAR_DISTANCE  = TILE_SIZE * 2
const DOOR_ENTER_DISTANCE = 16

export function useResident(keys: ReturnType<typeof useKeyboard>['keys']) {
  const resident = useResidentStore()
  const world    = useWorldStore()
  const scenario = useScenarioStore()

  function update() {
    const s = resident.speed
    let nx = resident.x
    let ny = resident.y

    if (keys.up)    ny -= s
    if (keys.down)  ny += s
    if (keys.left)  nx -= s
    if (keys.right) nx += s

    if (nx !== resident.x && canMoveTo(nx, resident.y)) resident.x = nx
    if (ny !== resident.y && canMoveTo(resident.x, ny)) resident.y = ny

    const approaching: Record<string, boolean> = {
      north: keys.down,
      south: keys.up,
      east:  keys.left,
      west:  keys.right,
    }

    world.nearbyLocation = null
    for (const loc of scenario.buildings) {
      const ap   = doorApproachPixels(loc)
      const dx   = resident.x - ap.x
      const dy   = resident.y - ap.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < DOOR_NEAR_DISTANCE) {
        world.nearbyLocation = loc.id
        if (!approaching[loc.door.edge]) world.exitLocked = false
        if (dist < DOOR_ENTER_DISTANCE && !world.exitLocked && approaching[loc.door.edge]) world.enterLocation(loc.scene)
        break
      }
    }
    if (!world.nearbyLocation) world.exitLocked = false
  }

  return { update }
}
