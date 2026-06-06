import { worldMap } from '~/data/worldMap'
import { TILE_SIZE, WORLD_COLS, WORLD_ROWS } from '~/types/simulation'

const RESIDENT_SIZE = 24 // half-width for corner checks

function isSolid(px: number, py: number): boolean {
  const col = Math.floor(px / TILE_SIZE)
  const row = Math.floor(py / TILE_SIZE)
  if (!Number.isFinite(col) || !Number.isFinite(row)) return true
  if (col < 0 || col >= WORLD_COLS || row < 0 || row >= WORLD_ROWS) return true
  return worldMap[row][col] === 3
}

export function canMoveTo(x: number, y: number): boolean {
  const r = RESIDENT_SIZE
  return (
    !isSolid(x - r, y - r) &&
    !isSolid(x + r, y - r) &&
    !isSolid(x + r, y + r) &&
    !isSolid(x - r, y + r)
  )
}
