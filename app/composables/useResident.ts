import { canMoveTo } from '~/composables/useCollision'
import { doorApproachPixels, doorTileRects } from '~/data/locations'
import { TILE_SIZE } from '~/types/simulation'

const DOOR_NEAR_DISTANCE  = TILE_SIZE * 2
const DOOR_ENTER_DISTANCE = 16

export function useResident(keys: ReturnType<typeof useKeyboard>['keys']) {
  const resident = useResidentStore()
  const world    = useWorldStore()
  const scenario = useScenarioStore()
  const input    = useInputStore()

  function update() {
    const s = resident.speed * input.throttle
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
      const ap = doorApproachPixels(loc)
      const approachDist = Math.hypot(resident.x - ap.x, resident.y - ap.y)
      // proximity counts the nearest of all door tiles, so multi-door
      // buildings work from every side
      const dist = Math.min(approachDist, ...doorTileRects(loc).map(t =>
        Math.hypot(resident.x - (t.x + t.width / 2), resident.y - (t.y + t.height / 2))))
      if (dist < DOOR_NEAR_DISTANCE) {
        world.nearbyLocation = loc.id
        if (!approaching[loc.door.edge]) world.exitLocked = false
        // classic trigger: standing at the approach point pushing toward the door
        const classic = approachDist < DOOR_ENTER_DISTANCE && approaching[loc.door.edge]
        // carved doorway: being on any door tile IS entering, no direction needed
        const onDoorTile = loc.doorway && doorTileRects(loc).some(t =>
          resident.x >= t.x && resident.x <= t.x + t.width
          && resident.y >= t.y && resident.y <= t.y + t.height)
        if ((classic || onDoorTile) && !world.exitLocked) world.enterLocation(loc.scene, loc.id)
        break
      }
    }
    if (!world.nearbyLocation) world.exitLocked = false
  }

  return { update }
}
