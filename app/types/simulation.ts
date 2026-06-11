export const TILE_SIZE = 48

export const WORLD_COLS = 40
export const WORLD_ROWS = 30

export const WORLD_WIDTH = WORLD_COLS * TILE_SIZE   // 1920
export const WORLD_HEIGHT = WORLD_ROWS * TILE_SIZE  // 1440

export type TileType = 0 | 1 | 2 | 3
// 0 = grass, 1 = path, 2 = water, 3 = wall/blocked

export interface BuildingDoor {
  edge: 'north' | 'south' | 'east' | 'west'
  offsetTiles: number
  // door cells in footprint-local [x, y] coords; standing on any of them
  // enters. Every door cell must be an access tile (they are implicitly
  // open). When present these override edge/offsetTiles, which stay as a
  // synced fallback for legacy direction-dependent logic.
  tiles?: number[][]
  tile?: number[]  // older single-tile form, superseded by tiles
}

// Shared definition of a kind of building, stored as a meta file in
// scenario/building-types/<id>.json. Instances copy these defaults and may
// diverge; the editor offers to propagate edits back.
export interface BuildingType {
  id: string
  name: string
  description: string
  scene: string
  image: string
  color: string
  tileW: number
  tileH: number
  door: { tiles: number[][] }
  openTiles: number[][]
}

export interface Building {
  id: string
  name: string
  type?: string  // BuildingType id this instance was created from
  tileX: number
  tileY: number
  tileW: number
  tileH: number
  color: string
  scene: string
  door: BuildingDoor
  doorway?: boolean  // scenario carved the door tile out of the wall (open recess)
  openTiles?: number[][]  // extra walkable cells in the footprint, local [x, y] coords
  image?: string  // overworld sprite URL; falls back to color rect when absent
}

export interface Resident {
  x: number
  y: number
  speed: number
}

export interface FinanceEntry {
  id: string
  date: string
  category: string
  description: string
  amount: number
  type: 'income' | 'expense'
}
