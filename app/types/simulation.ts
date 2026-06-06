export const TILE_SIZE = 48

export const WORLD_COLS = 40
export const WORLD_ROWS = 30

export const WORLD_WIDTH = WORLD_COLS * TILE_SIZE   // 1920
export const WORLD_HEIGHT = WORLD_ROWS * TILE_SIZE  // 1440

export type TileType = 0 | 1 | 2 | 3
// 0 = grass, 1 = path, 2 = water, 3 = wall/blocked

export interface Building {
  id: string
  name: string
  tileX: number
  tileY: number
  tileW: number
  tileH: number
  color: string
  scene: string
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
