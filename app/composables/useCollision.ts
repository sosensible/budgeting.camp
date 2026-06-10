const RESIDENT_SIZE = 24

function isSolid(px: number, py: number): boolean {
  const scenario = useScenarioStore()
  const { tileSize, cols, rows } = scenario.world
  const col = Math.floor(px / tileSize)
  const row = Math.floor(py / tileSize)
  if (!Number.isFinite(col) || !Number.isFinite(row)) return true
  if (col < 0 || col >= cols || row < 0 || row >= rows) return true
  return scenario.tilemap[row][col] === 3
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
