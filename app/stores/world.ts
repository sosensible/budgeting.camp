import { doorApproachPixels, doorTileRects, doorOutwardDirFor } from '~/data/locations'
import { canMoveTo } from '~/composables/useCollision'
import { TILE_SIZE } from '~/types/simulation'

export const useWorldStore = defineStore('world', () => {
  const nearbyLocation = ref<string | null>(null)
  const currentScene = ref<string>('overworld')
  const currentBuildingId = ref<string | null>(null)  // the building actually entered
  const exitLocked = ref(false)  // prevents re-entry until resident walks away from the door

  function enterLocation(sceneId: string, buildingId?: string) {
    currentScene.value = sceneId
    currentBuildingId.value = buildingId ?? null
  }

  function leaveLocation() {
    // push the resident out from the door so the next input can't instantly
    // re-trigger the entrance; scenes can be shared by several buildings,
    // so use the one whose door the resident is at
    const resident = useResidentStore()
    const all = useScenarioStore().buildings
    const building = all.find(b => b.id === currentBuildingId.value)
      ?? all
        .filter(b => b.scene === currentScene.value)
        .sort((a, b) => {
          const da = doorApproachPixels(a), db = doorApproachPixels(b)
          return Math.hypot(da.x - resident.x, da.y - resident.y)
               - Math.hypot(db.x - resident.x, db.y - resident.y)
        })[0]
    if (building) {
      // push out through the door tile nearest the resident, in the
      // direction from the building center through that tile
      const t = doorTileRects(building).sort((a, b) =>
        Math.hypot(resident.x - (a.x + a.width / 2), resident.y - (a.y + a.height / 2))
        - Math.hypot(resident.x - (b.x + b.width / 2), resident.y - (b.y + b.height / 2)))[0]
      const doorC = { x: t.x + t.width / 2, y: t.y + t.height / 2 }
      const out = doorOutwardDirFor(building, t)

      // walk outward from the door tile until clear of the footprint and
      // standing on walkable ground
      const foot = {
        x0: building.tileX * TILE_SIZE, y0: building.tileY * TILE_SIZE,
        x1: (building.tileX + building.tileW) * TILE_SIZE,
        y1: (building.tileY + building.tileH) * TILE_SIZE,
      }
      let placed = false
      for (let k = 1; k <= 5 && !placed; k++) {
        const x = doorC.x + out[0] * k * TILE_SIZE
        const y = doorC.y + out[1] * k * TILE_SIZE
        const outside = x < foot.x0 || x > foot.x1 || y < foot.y0 || y > foot.y1
        if (outside && canMoveTo(x, y)) {
          resident.x = x
          resident.y = y
          placed = true
        }
      }
      if (!placed) {
        const ap = doorApproachPixels(building)
        resident.x = ap.x
        resident.y = ap.y
      }
    }
    currentScene.value = 'overworld'
    currentBuildingId.value = null
    exitLocked.value = true
  }

  function reset() {
    currentScene.value  = 'overworld'
    currentBuildingId.value = null
    nearbyLocation.value = null
    exitLocked.value    = false
  }

  return { nearbyLocation, currentScene, currentBuildingId, exitLocked, enterLocation, leaveLocation, reset }
})
