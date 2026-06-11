<script setup lang="ts">
import type { Building, BuildingType } from '~/types/simulation'
import type { ScenarioData } from '~/stores/scenario'
import { BUILDING_TYPES, BUILDING_TYPE_LIST } from '~/data/buildingTypes'

const route = useRoute()
const router = useRouter()
const scenario = useScenarioStore()

const scenarioId = (route.query.id as string) || ''
scenario.load(scenarioId)
if (!scenario.data.editable) router.replace('/')

// the editor isn't supported on phone-sized displays
const isPhone = useIsPhone()
watch(isPhone, (phone) => { if (phone) router.replace('/') })

// Saving rewrites scenario.json, which triggers a Vite HMR re-execution of
// the scenario store module that can reset the live store mid-session. The
// editor therefore works entirely from this setup-time snapshot and never
// renders from (or saves from) the reactive store.
const original: ScenarioData = JSON.parse(JSON.stringify(scenario.data))

const TILE = original.world.tileSize
const COLS = original.world.cols
const ROWS = original.world.rows
const WALL_X = 3  // border wall thickness (cols)
const WALL_Y = 2  // border wall thickness (rows)

const SCENE_OPTIONS = ['home-tent', 'market', 'supply-tent', 'diner', 'bank', 'workshop']

// --- working copy ---
const buildings = reactive<Building[]>(JSON.parse(JSON.stringify(original.buildings)))
const spawn = reactive({ ...original.resident })
const dirty = ref(false)
const saving = ref(false)
const saveMsg = ref('')
const selectedId = ref<string | null>(null)

const selected = computed(() => buildings.find(b => b.id === selectedId.value) ?? null)

// instances whose type-level fields were edited this session, and the last
// edited instance per type (the propagation source on save)
const touched = reactive(new Set<string>())
const lastTouchedOfType = reactive<Record<string, string>>({})

function markTouched(b: Building | null) {
  if (!b) return
  touched.add(b.id)
  if (b.type) lastTouchedOfType[b.type] = b.id
}

// door placement mode: perimeter tiles of the selected building become
// clickable so the door is drawn exactly where the artwork shows it
const doorMode = ref(false)
// access painting mode: footprint tiles toggle between blocked and walkable,
// letting the player walk to where the artwork actually shows the entrance
const accessMode = ref(false)
watch(selectedId, () => { doorMode.value = false; accessMode.value = false })
watch(doorMode, (on) => { if (on) accessMode.value = false })
watch(accessMode, (on) => { if (on) doorMode.value = false })

function doorTilesOf(b: Building): number[][] {
  if (b.door.tiles?.length) return b.door.tiles
  if (b.door.tile) return [b.door.tile]
  const { edge, offsetTiles } = b.door
  if (edge === 'north') return [[offsetTiles, 0]]
  if (edge === 'south') return [[offsetTiles, b.tileH - 1]]
  if (edge === 'east') return [[b.tileW - 1, offsetTiles]]
  return [[0, offsetTiles]]
}

function isDoorTile(b: Building, lx: number, ly: number) {
  return doorTilesOf(b).some(([x, y]) => x === lx && y === ly)
}

// keep the legacy edge/offset synced to the first door tile
function syncDoorFallback(b: Building) {
  const first = doorTilesOf(b)[0]
  if (!first) return
  const dx = first[0] - (b.tileW - 1) / 2
  const dy = first[1] - (b.tileH - 1) / 2
  if (Math.abs(dx) >= Math.abs(dy)) {
    b.door.edge = dx >= 0 ? 'east' : 'west'
    b.door.offsetTiles = first[1]
  } else {
    b.door.edge = dy >= 0 ? 'south' : 'north'
    b.door.offsetTiles = first[0]
  }
}

// doors can only sit on access tiles — candidates are the painted open
// tiles; current door tiles show brown and click off, green tiles click on
const doorCells = computed(() => {
  const b = selected.value
  if (!doorMode.value || !b) return []
  const seen = new Set<string>()
  const cells = [...(b.openTiles ?? []), ...doorTilesOf(b)]
    .filter(([x, y]) => {
      const k = `${x},${y}`
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
  return cells.map(([lx, ly]) => {
    const isDoor = isDoorTile(b, lx, ly)
    return {
      key: `${lx}-${ly}`,
      lx,
      ly,
      config: {
        x: (b.tileX + lx) * TILE,
        y: (b.tileY + ly) * TILE,
        width: TILE,
        height: TILE,
        fill: isDoor ? 'rgba(107, 66, 38, 0.35)' : 'rgba(104, 211, 145, 0.4)',
        stroke: isDoor ? '#ffffff' : '#68d391',
        strokeWidth: 2,
      },
    }
  })
})

function toggleDoorTile(lx: number, ly: number) {
  const b = selected.value
  if (!b) return
  if (!b.door.tiles) b.door.tiles = doorTilesOf(b)
  delete b.door.tile  // migrate older single-tile form
  const i = b.door.tiles.findIndex(([x, y]) => x === lx && y === ly)
  if (i >= 0) {
    if (b.door.tiles.length === 1) {
      window.alert('A building needs at least one door tile.')
      return
    }
    b.door.tiles.splice(i, 1)
    // the tile was accessible as a door, so it stays accessible as a
    // plain open tile rather than reverting to wall
    if (!b.openTiles) b.openTiles = []
    if (!b.openTiles.some(([x, y]) => x === lx && y === ly)) {
      b.openTiles.push([lx, ly])
    }
  } else {
    b.door.tiles.push([lx, ly])
  }
  syncDoorFallback(b)
  markTouched(b)
  dirty.value = true
}

const accessCells = computed(() => {
  const b = selected.value
  if (!accessMode.value || !b) return []
  const open = new Set((b.openTiles ?? []).map(([x, y]) => `${x},${y}`))
  const cells = []
  for (let ly = 0; ly < b.tileH; ly++) {
    for (let lx = 0; lx < b.tileW; lx++) {
      const isDoor = isDoorTile(b, lx, ly)
      const isOpen = open.has(`${lx},${ly}`)
      cells.push({
        key: `${lx}-${ly}`,
        lx,
        ly,
        config: {
          x: (b.tileX + lx) * TILE,
          y: (b.tileY + ly) * TILE,
          width: TILE,
          height: TILE,
          // the door tile is implicitly open — brown with the open-green border
          fill: isDoor ? 'rgba(107, 66, 38, 0.35)'
            : isOpen ? 'rgba(104, 211, 145, 0.5)'
            : 'rgba(20, 20, 31, 0.55)',
          stroke: isDoor ? '#68d391' : 'rgba(255, 255, 255, 0.3)',
          strokeWidth: isDoor ? 2 : 1,
        },
      })
    }
  }
  return cells
})

function toggleAccess(lx: number, ly: number) {
  const b = selected.value
  if (!b) return
  if (isDoorTile(b, lx, ly)) {
    // a door can only exist where there is access, so closing this tile
    // means removing the door from it
    const remove = window.confirm(
      'This is a door tile — doors must sit on access tiles.\n'
      + 'Remove the door from this tile and close it?',
    )
    if (!remove) return
    if (!b.door.tiles) b.door.tiles = doorTilesOf(b)
    delete b.door.tile
    const di = b.door.tiles.findIndex(([x, y]) => x === lx && y === ly)
    if (di >= 0) b.door.tiles.splice(di, 1)
    if (b.openTiles) {
      const i = b.openTiles.findIndex(([x, y]) => x === lx && y === ly)
      if (i >= 0) b.openTiles.splice(i, 1)
    }
    markTouched(b)
    dirty.value = true
    if (!b.door.tiles.length) {
      // no doors left — jump straight to placing one
      doorMode.value = true
    } else {
      syncDoorFallback(b)
    }
    return
  }
  if (!b.openTiles) b.openTiles = []
  const i = b.openTiles.findIndex(([x, y]) => x === lx && y === ly)
  if (i >= 0) b.openTiles.splice(i, 1)
  else b.openTiles.push([lx, ly])
  markTouched(b)
  dirty.value = true
}

// --- stage pan/zoom ---
const vpW = ref(0)
const vpH = ref(0)
const stagePos = reactive({ x: 0, y: 0 })
const stageScale = ref(0.5)

onMounted(() => {
  vpW.value = window.innerWidth
  vpH.value = window.innerHeight
  // center on spawn
  stagePos.x = vpW.value / 2 - spawn.spawnTileX * TILE * stageScale.value
  stagePos.y = vpH.value / 2 - spawn.spawnTileY * TILE * stageScale.value
})

const stageConfig = computed(() => ({
  width: vpW.value,
  height: vpH.value,
  x: stagePos.x,
  y: stagePos.y,
  scaleX: stageScale.value,
  scaleY: stageScale.value,
  draggable: true,
}))

function onStageDragEnd(e: { target: { x(): number, y(): number, getClassName(): string } }) {
  if (e.target.getClassName() !== 'Stage') return
  stagePos.x = e.target.x()
  stagePos.y = e.target.y()
}

function onWheel(e: { evt: WheelEvent, target: { getStage(): { getPointerPosition(): { x: number, y: number } | null } } }) {
  e.evt.preventDefault()
  const ptr = e.target.getStage().getPointerPosition()
  if (!ptr) return
  const old = stageScale.value
  const next = Math.min(1.5, Math.max(0.15, old * (e.evt.deltaY < 0 ? 1.08 : 1 / 1.08)))
  // zoom around pointer
  stagePos.x = ptr.x - ((ptr.x - stagePos.x) / old) * next
  stagePos.y = ptr.y - ((ptr.y - stagePos.y) / old) * next
  stageScale.value = next
}

// --- background chunks (load all; editor only) ---
const chunkImages = reactive<Record<string, HTMLImageElement | null>>({})
const bgChunks = computed(() => {
  const bc = original.backgroundChunks
  if (!bc) return []
  const out = []
  for (let r = 0; r < bc.rows; r++) {
    for (let c = 0; c < bc.cols; c++) {
      const src = bc.urlPattern.replace('{r}', String(r)).replace('{c}', String(c))
      if (!(src in chunkImages) && import.meta.client) {
        chunkImages[src] = null
        const img = new Image()
        img.onload = () => { chunkImages[src] = img }
        img.src = src
      }
      if (chunkImages[src]) {
        out.push({ key: `${r}-${c}`, config: {
          image: chunkImages[src], x: c * bc.chunkW, y: r * bc.chunkH,
          width: bc.chunkW, height: bc.chunkH, listening: false,
        } })
      }
    }
  }
  return out
})

// --- building sprites ---
const spriteImages = reactive<Record<string, HTMLImageElement | null>>({})
function spriteFor(b: Building) {
  if (!b.image) return null
  if (!(b.image in spriteImages) && import.meta.client) {
    spriteImages[b.image] = null
    const img = new Image()
    const src = b.image
    img.onload = () => { spriteImages[src] = img }
    img.src = src
  }
  return spriteImages[b.image]
}

const buildingNodes = computed(() => buildings.map((b) => {
  const px = { x: b.tileX * TILE, y: b.tileY * TILE, width: b.tileW * TILE, height: b.tileH * TILE }
  const sprite = spriteFor(b)
  let image = null
  if (sprite) {
    const width = px.width * 1.12
    const height = width * (sprite.height / sprite.width)
    image = {
      id: b.id, image: sprite,
      x: px.x + (px.width - width) / 2, y: px.y + px.height - height,
      width, height, draggable: true,
    }
  }
  return {
    id: b.id,
    image,
    fallback: { id: b.id, ...px, fill: b.color, cornerRadius: 4, draggable: true },
    outline: {
      ...px,
      stroke: selectedId.value === b.id ? '#63b3ed' : 'rgba(255,255,255,0.25)',
      strokeWidth: selectedId.value === b.id ? 3 : 1,
      dash: selectedId.value === b.id ? undefined : [6, 6],
      listening: false,
    },
    // doors shown as bold asterisks centered on their tiles
    doors: doorTilesOf(b).map(([lx, ly]) => ({
      x: (b.tileX + lx) * TILE,
      y: (b.tileY + ly) * TILE + TILE * 0.08,
      width: TILE,
      height: TILE,
      text: '✱',
      fontSize: TILE * 0.8,
      fontStyle: 'bold',
      align: 'center' as const,
      verticalAlign: 'middle' as const,
      fill: '#fff3d6',
      shadowColor: '#000000',
      shadowBlur: 8,
      shadowOpacity: 0.9,
      listening: false,
    })),
    label: {
      x: px.x + px.width / 2, y: px.y - 22, text: b.name,
      fontSize: 16, fontStyle: 'bold', fill: '#ffffff', align: 'center' as const,
      offsetX: 90, width: 180, shadowColor: '#000', shadowBlur: 4, listening: false,
    },
  }
}))

const spawnMarker = computed(() => ({
  x: spawn.spawnTileX * TILE + TILE / 2,
  y: spawn.spawnTileY * TILE + TILE / 2,
  radius: 20,
  fill: '#f6e05e',
  stroke: '#d69e2e',
  strokeWidth: 3,
  draggable: true,
}))

// --- interactions ---
function clampTileX(b: Building, tx: number) { return Math.min(COLS - WALL_X - b.tileW, Math.max(WALL_X, tx)) }
function clampTileY(b: Building, ty: number) { return Math.min(ROWS - WALL_Y - b.tileH, Math.max(WALL_Y, ty)) }

function tileInBuilding(tx: number, ty: number, b: Building) {
  return tx >= b.tileX && tx < b.tileX + b.tileW && ty >= b.tileY && ty < b.tileY + b.tileH
}

function onBuildingDragEnd(id: string, e: { target: { x(): number, y(): number, width(): number, height(): number, position(p: { x: number, y: number }): void } }) {
  const b = buildings.find(x => x.id === id)
  if (!b) return
  // sprite nodes are wider than the footprint and bottom-aligned to it;
  // derive the footprint from the node's center-x and bottom-y
  const footX = e.target.x() + e.target.width() / 2 - (b.tileW * TILE) / 2
  const footY = e.target.y() + e.target.height() - b.tileH * TILE
  const tx = clampTileX(b, Math.round(footX / TILE))
  const ty = clampTileY(b, Math.round(footY / TILE))
  // the scenario start position must stay outside every building
  if (tileInBuilding(spawn.spawnTileX, spawn.spawnTileY, { ...b, tileX: tx, tileY: ty })) {
    window.alert('That spot covers the scenario start position (yellow circle). Move the start point first, or drop the building elsewhere.')
  } else {
    b.tileX = tx
    b.tileY = ty
    dirty.value = true
  }
  selectedId.value = id
  syncNode(e.target, b)  // snap the node onto the grid-aligned footprint
}

function syncNode(node: { position(p: { x: number, y: number }): void, width(): number, height(): number }, b: Building) {
  const px = { x: b.tileX * TILE, y: b.tileY * TILE, width: b.tileW * TILE, height: b.tileH * TILE }
  const w = node.width()
  if (w > px.width) {
    node.position({ x: px.x + (px.width - w) / 2, y: px.y + px.height - node.height() })
  } else {
    node.position({ x: px.x, y: px.y })
  }
}

function onSpawnDragEnd(e: { target: { x(): number, y(): number, position(p: { x: number, y: number }): void } }) {
  const tx = Math.min(COLS - WALL_X - 1, Math.max(WALL_X, Math.round((e.target.x() - TILE / 2) / TILE)))
  const ty = Math.min(ROWS - WALL_Y - 1, Math.max(WALL_Y, Math.round((e.target.y() - TILE / 2) / TILE)))
  // the start position can't be inside a building's footprint
  if (buildings.some(b => tileInBuilding(tx, ty, b))) {
    window.alert('The scenario start position cannot be inside a building.')
  } else {
    spawn.spawnTileX = tx
    spawn.spawnTileY = ty
    dirty.value = true
  }
  e.target.position({ x: spawn.spawnTileX * TILE + TILE / 2, y: spawn.spawnTileY * TILE + TILE / 2 })
}

function selectBuilding(id: string) { selectedId.value = id }
function onStageClick(e: { target: { getClassName(): string } }) {
  if (e.target.getClassName() === 'Stage') selectedId.value = null
}

function duplicateSelected() {
  if (!selected.value) return
  const src = selected.value
  const base = src.id.replace(/-\d+$/, '')
  let n = buildings.length
  while (buildings.some(b => b.id === `${base}-${n}`)) n++
  const copy: Building = JSON.parse(JSON.stringify(src))
  copy.id = `${base}-${n}`
  copy.tileX = clampTileX(copy, copy.tileX + 2)
  copy.tileY = clampTileY(copy, copy.tileY + 2)
  if (tileInBuilding(spawn.spawnTileX, spawn.spawnTileY, copy)) {
    copy.tileX = clampTileX(copy, spawn.spawnTileX + 2)
    copy.tileY = clampTileY(copy, spawn.spawnTileY + 2)
  }
  buildings.push(copy)
  selectedId.value = copy.id
  dirty.value = true
}

function deleteSelected() {
  if (!selected.value) return
  const i = buildings.findIndex(b => b.id === selectedId.value)
  if (i >= 0) buildings.splice(i, 1)
  selectedId.value = null
  dirty.value = true
}

// --- add building from the type palette ---
function addBuilding(typeId: string) {
  const t = BUILDING_TYPES[typeId]
  if (!t) return
  let n = buildings.length
  while (buildings.some(b => b.id === `${typeId}-${n}`)) n++
  const nb: Building = {
    id: `${typeId}-${n}`,
    name: t.name,
    type: t.id,
    tileX: 0,
    tileY: 0,
    tileW: t.tileW,
    tileH: t.tileH,
    color: t.color,
    scene: t.scene,
    door: { edge: 'south', offsetTiles: 0, tiles: JSON.parse(JSON.stringify(t.door.tiles)) },
    doorway: true,
    openTiles: JSON.parse(JSON.stringify(t.openTiles)),
    image: t.image,
  }
  // drop at the current viewport center, snapped and clamped
  const worldX = (vpW.value / 2 - stagePos.x) / stageScale.value
  const worldY = (vpH.value / 2 - stagePos.y) / stageScale.value
  nb.tileX = clampTileX(nb, Math.round(worldX / TILE - nb.tileW / 2))
  nb.tileY = clampTileY(nb, Math.round(worldY / TILE - nb.tileH / 2))
  // never drop a new building onto the scenario start position
  if (tileInBuilding(spawn.spawnTileX, spawn.spawnTileY, nb)) {
    nb.tileX = clampTileX(nb, spawn.spawnTileX + 2)
    nb.tileY = clampTileY(nb, spawn.spawnTileY + 2)
  }
  syncDoorFallback(nb)
  buildings.push(nb)
  selectedId.value = nb.id
  dirty.value = true
}

function markDirty() {
  markTouched(selected.value)
  dirty.value = true
}

// --- save ---
function buildTilemap(): number[][] {
  const map = Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  for (let c = 0; c < COLS; c++) { map[0][c] = map[1][c] = map[ROWS - 2][c] = map[ROWS - 1][c] = 3 }
  for (let r = 0; r < ROWS; r++) { for (const c of [0, 1, 2, COLS - 3, COLS - 2, COLS - 1]) map[r][c] = 3 }
  for (const b of buildings) {
    for (let r = b.tileY; r < b.tileY + b.tileH; r++) {
      for (let c = b.tileX; c < b.tileX + b.tileW; c++) map[r][c] = 3
    }
    if (b.doorway) {
      for (const [dlx, dly] of doorTilesOf(b)) {
        map[b.tileY + dly][b.tileX + dlx] = 1
      }
    }
    for (const [lx, ly] of b.openTiles ?? []) {
      if (lx >= 0 && lx < b.tileW && ly >= 0 && ly < b.tileH) {
        map[b.tileY + ly][b.tileX + lx] = 1
      }
    }
  }
  return map
}

// --- type propagation prompts ---
interface TypePrompt { typeId: string, typeName: string, count: number, srcId: string }
interface TypeDecision extends TypePrompt { scope: 'instance' | 'all', updateSource: boolean }

const typePrompts = ref<TypePrompt[]>([])
const promptIndex = ref(0)
const promptScope = ref<'instance' | 'all'>('instance')
const promptUpdateSource = ref(false)
let pendingDecisions: TypeDecision[] = []

const sortTiles = (t?: number[][]) =>
  JSON.stringify([...(t ?? [])].map(([x, y]) => [x, y]).sort((a, b) => a[0] - b[0] || a[1] - b[1]))

function typeLevelDiffers(b: Building, meta: BuildingType) {
  return sortTiles(doorTilesOf(b)) !== sortTiles(meta.door.tiles)
    || sortTiles(b.openTiles) !== sortTiles(meta.openTiles)
    || b.scene !== meta.scene
}

function save() {
  const prompts: TypePrompt[] = []
  for (const [typeId, srcId] of Object.entries(lastTouchedOfType)) {
    const meta = BUILDING_TYPES[typeId]
    const src = buildings.find(b => b.id === srcId)
    if (!meta || !src || !touched.has(srcId)) continue
    if (typeLevelDiffers(src, meta)) {
      prompts.push({
        typeId,
        typeName: meta.name,
        count: buildings.filter(b => b.type === typeId).length,
        srcId,
      })
    }
  }
  if (prompts.length) {
    typePrompts.value = prompts
    promptIndex.value = 0
    promptScope.value = 'instance'
    promptUpdateSource.value = false
    pendingDecisions = []
    return  // the modal continues the save
  }
  void doSave([])
}

function confirmPrompt() {
  const p = typePrompts.value[promptIndex.value]
  pendingDecisions.push({ ...p, scope: promptScope.value, updateSource: promptUpdateSource.value })
  if (promptIndex.value + 1 < typePrompts.value.length) {
    promptIndex.value++
    promptScope.value = 'instance'
    promptUpdateSource.value = false
  } else {
    typePrompts.value = []
    void doSave(pendingDecisions)
  }
}

function cancelPrompt() {
  typePrompts.value = []
  pendingDecisions = []
}

async function doSave(decisions: TypeDecision[]) {
  saving.value = true
  saveMsg.value = ''
  try {
    const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v))

    // propagate "all instances" decisions onto the working copy
    for (const d of decisions) {
      if (d.scope !== 'all') continue
      const src = buildings.find(b => b.id === d.srcId)
      if (!src) continue
      for (const b of buildings) {
        if (b.type !== d.typeId || b.id === src.id) continue
        b.door = { ...b.door, tiles: clone(doorTilesOf(src)) }
        delete b.door.tile
        b.openTiles = clone(src.openTiles ?? [])
        b.scene = src.scene
        syncDoorFallback(b)
      }
    }

    // "update source type" decisions become meta-file writes
    const types = decisions.filter(d => d.updateSource).map((d) => {
      const src = buildings.find(b => b.id === d.srcId)!
      const meta: BuildingType = {
        ...clone(BUILDING_TYPES[d.typeId]),
        scene: src.scene,
        door: { tiles: clone(doorTilesOf(src)) },
        openTiles: clone(src.openTiles ?? []),
      }
      Object.assign(BUILDING_TYPES[d.typeId], meta)  // future placements this session
      return { id: d.typeId, meta }
    })

    const data: ScenarioData = clone(original)
    data.buildings = clone(buildings)
    data.tilemap = buildTilemap() as ScenarioData['tilemap']
    data.resident = { ...spawn }
    await $fetch('/api/editor/save', { method: 'POST', body: { id: scenarioId, scenario: data, types } })
    dirty.value = false
    touched.clear()
    for (const k of Object.keys(lastTouchedOfType)) delete lastTouchedOfType[k]
    saveMsg.value = 'Saved'
  } catch (err) {
    saveMsg.value = `Save failed: ${err}`
  } finally {
    saving.value = false
    setTimeout(() => { saveMsg.value = '' }, 3000)
  }
}
</script>

<template>
  <ClientOnly>
    <div class="editor-root">
      <v-stage
        :config="stageConfig"
        @dragend="onStageDragEnd"
        @wheel="onWheel"
        @click="onStageClick"
        @tap="onStageClick"
      >
        <v-layer>
          <v-image v-for="ch in bgChunks" :key="ch.key" :config="ch.config" />
        </v-layer>
        <v-layer>
          <template v-for="b in buildingNodes" :key="b.id">
            <v-image
              v-if="b.image"
              :config="b.image"
              @click="selectBuilding(b.id)"
              @tap="selectBuilding(b.id)"
              @dragend="(e: any) => onBuildingDragEnd(b.id, e)"
            />
            <v-rect
              v-else
              :config="b.fallback"
              @click="selectBuilding(b.id)"
              @tap="selectBuilding(b.id)"
              @dragend="(e: any) => onBuildingDragEnd(b.id, e)"
            />
            <v-rect :config="b.outline" />
            <v-text v-for="(d, i) in b.doors" :key="`${b.id}-door-${i}`" :config="d" />
            <v-text :config="b.label" />
          </template>
          <v-circle :config="spawnMarker" @dragend="onSpawnDragEnd" />
          <v-rect
            v-for="cell in doorCells"
            :key="cell.key"
            :config="cell.config"
            @click="toggleDoorTile(cell.lx, cell.ly)"
            @tap="toggleDoorTile(cell.lx, cell.ly)"
          />
          <v-rect
            v-for="cell in accessCells"
            :key="`a-${cell.key}`"
            :config="cell.config"
            @click="toggleAccess(cell.lx, cell.ly)"
            @tap="toggleAccess(cell.lx, cell.ly)"
          />
        </v-layer>
      </v-stage>

      <div class="panel">
        <div class="panel-head">
          <strong>{{ original.name }}</strong>
          <span class="hint">drag buildings · scroll to zoom · drag map to pan</span>
        </div>

        <template v-if="selected">
          <p v-if="selected.type" class="hint type-line">
            Type: {{ BUILDING_TYPES[selected.type]?.name ?? selected.type }}
          </p>
          <label>Name
            <input v-model="selected.name" type="text" @input="markDirty">
          </label>
          <label>Scene
            <select v-model="selected.scene" @change="markDirty">
              <option v-for="s in SCENE_OPTIONS" :key="s" :value="s">{{ s }}</option>
            </select>
          </label>
          <div class="door-row">
            <span class="hint">Doors: {{ doorTilesOf(selected).length }}</span>
            <button :class="{ active: doorMode }" @click="doorMode = !doorMode">
              {{ doorMode ? 'Done' : 'Edit Doors' }}
            </button>
          </div>
          <p v-if="doorMode" class="hint">
            {{ selected.openTiles?.length
              ? 'Click green access tiles to add doors, brown door tiles to remove them.'
              : 'No access tiles yet — use Paint Access first; doors must sit on access tiles.' }}
          </p>
          <div class="door-row">
            <span class="hint">Open tiles: {{ selected.openTiles?.length ?? 0 }}</span>
            <button :class="{ active: accessMode }" @click="accessMode = !accessMode">
              {{ accessMode ? 'Done' : 'Paint Access' }}
            </button>
          </div>
          <p v-if="accessMode" class="hint">
            Click footprint tiles to toggle them walkable (green = open, dark =
            blocked). The brown door tile counts as open — clicking it lets you
            move the door.
          </p>
          <div class="row">
            <button @click="duplicateSelected">Duplicate</button>
            <button class="danger" @click="deleteSelected">Delete</button>
          </div>
        </template>
        <p v-else class="hint">Click a building to edit it. The yellow circle is the spawn point.</p>

        <div class="palette">
          <span class="hint">Add building</span>
          <div class="palette-grid">
            <button
              v-for="t in BUILDING_TYPE_LIST"
              :key="t.id"
              :title="t.description"
              @click="addBuilding(t.id)"
            >
              {{ t.name }}
            </button>
          </div>
        </div>

        <div class="row footer">
          <button :disabled="!dirty || saving" class="primary" @click="save">
            {{ saving ? 'Saving…' : dirty ? 'Save' : 'Saved' }}
          </button>
          <button @click="router.push('/')">Back</button>
        </div>
        <p v-if="saveMsg" class="hint">{{ saveMsg }}</p>
      </div>

      <div v-if="typePrompts.length" class="modal-backdrop">
        <div class="modal">
          <strong>{{ typePrompts[promptIndex].typeName }} changed</strong>
          <p class="hint">
            You edited type-level settings (doors, access tiles, or scene).
            Apply the change to:
          </p>
          <label class="choice">
            <input v-model="promptScope" type="radio" value="instance">
            This instance only
          </label>
          <label class="choice">
            <input v-model="promptScope" type="radio" value="all">
            All {{ typePrompts[promptIndex].count }} instances in this scenario
          </label>
          <label class="choice source">
            <input v-model="promptUpdateSource" type="checkbox">
            Also update the source type (affects future placements and other scenarios)
          </label>
          <div class="row">
            <button class="primary" @click="confirmPrompt">
              {{ promptIndex + 1 < typePrompts.length ? 'Next' : 'Save' }}
            </button>
            <button @click="cancelPrompt">Cancel</button>
          </div>
          <p v-if="typePrompts.length > 1" class="hint">
            {{ promptIndex + 1 }} of {{ typePrompts.length }} changed types
          </p>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.editor-root {
  position: fixed;
  inset: 0;
  background: #14141f;
  user-select: none;
}

.panel {
  position: fixed;
  top: 16px;
  right: 16px;
  width: 250px;
  background: rgba(20, 26, 38, 0.95);
  border: 1px solid #2d3748;
  border-radius: 10px;
  padding: 1rem;
  color: #e2e8f0;
  font-family: system-ui, sans-serif;
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  z-index: 30;
}

.panel-head { display: flex; flex-direction: column; gap: 0.2rem; }
.hint { color: #718096; font-size: 0.75rem; margin: 0; }

label { display: flex; flex-direction: column; gap: 0.25rem; color: #a0aec0; }

input, select {
  background: #1e2a3a;
  border: 1px solid #2d3748;
  border-radius: 6px;
  color: #e2e8f0;
  padding: 0.35rem 0.5rem;
  font-size: 0.85rem;
}

.row { display: flex; gap: 0.5rem; }
.row.footer { margin-top: 0.4rem; }

.door-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.type-line { margin: 0; }

.palette {
  border-top: 1px solid #2d3748;
  padding-top: 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.palette-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4rem;
}

.palette-grid button {
  font-size: 0.78rem;
  padding: 0.4rem 0.3rem;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
}

.modal {
  width: 340px;
  background: #1a2230;
  border: 1px solid #2d3748;
  border-radius: 10px;
  padding: 1.1rem;
  color: #e2e8f0;
  font-family: system-ui, sans-serif;
  font-size: 0.88rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.choice {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  color: #cbd5e0;
  cursor: pointer;
}

.choice input { accent-color: #68d391; }
.choice.source {
  border-top: 1px solid #2d3748;
  padding-top: 0.6rem;
  color: #a0aec0;
}
.door-row button { flex: 0 0 auto; padding: 0.35rem 0.7rem; }
.door-row button.active { background: #68d391; color: #14141f; }

button {
  flex: 1;
  padding: 0.45rem 0.6rem;
  background: #2d3748;
  color: #e2e8f0;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
}
button:hover { background: #3a4a5e; }
button:disabled { opacity: 0.5; cursor: default; }
button.primary { background: #2b6cb0; }
button.primary:hover:not(:disabled) { background: #3182ce; }
button.danger { background: #742a2a; }
button.danger:hover { background: #9b2c2c; }
</style>
