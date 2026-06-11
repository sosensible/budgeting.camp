import type { Building } from '~/types/simulation'
import { TILE_SIZE } from '~/types/simulation'

export const locations: Building[] = [
  {
    id: 'home',
    name: 'Home',
    tileX: 2, tileY: 4, tileW: 4, tileH: 3,
    color: '#c6a96b',
    scene: 'home',
    door: { edge: 'south', offsetTiles: 1 },
  },
  {
    id: 'bank',
    name: 'Bank',
    tileX: 11, tileY: 12, tileW: 5, tileH: 3,
    color: '#6baed6',
    scene: 'bank',
    door: { edge: 'north', offsetTiles: 2 },
  },
  {
    id: 'general-store',
    name: 'General Store',
    tileX: 25, tileY: 12, tileW: 4, tileH: 3,
    color: '#74c476',
    scene: 'general-store',
    door: { edge: 'north', offsetTiles: 1 },
  },
  {
    id: 'workplace',
    name: 'Workplace',
    tileX: 31, tileY: 21, tileW: 6, tileH: 4,
    color: '#9e9ac8',
    scene: 'workplace',
    door: { edge: 'north', offsetTiles: 2 },
  },
  {
    id: 'clothing-store',
    name: 'Clothing Store',
    tileX: 16, tileY: 25, tileW: 5, tileH: 3,
    color: '#fc8d59',
    scene: 'clothing-store',
    door: { edge: 'north', offsetTiles: 2 },
  },
]

export function toPixels(building: Building) {
  return {
    x: building.tileX * TILE_SIZE,
    y: building.tileY * TILE_SIZE,
    width: building.tileW * TILE_SIZE,
    height: building.tileH * TILE_SIZE,
  }
}

const DOOR_W = TILE_SIZE
const DOOR_DEPTH = 8

export function doorPixels(building: Building) {
  const { tileX, tileY, tileW, tileH, door: { edge, offsetTiles } } = building
  switch (edge) {
    case 'north': return { x: (tileX + offsetTiles) * TILE_SIZE, y: tileY * TILE_SIZE,                        width: DOOR_W,    height: DOOR_DEPTH }
    case 'south': return { x: (tileX + offsetTiles) * TILE_SIZE, y: (tileY + tileH) * TILE_SIZE - DOOR_DEPTH, width: DOOR_W,    height: DOOR_DEPTH }
    case 'east':  return { x: (tileX + tileW) * TILE_SIZE - DOOR_DEPTH, y: (tileY + offsetTiles) * TILE_SIZE, width: DOOR_DEPTH, height: DOOR_W }
    case 'west':  return { x: tileX * TILE_SIZE,                         y: (tileY + offsetTiles) * TILE_SIZE, width: DOOR_DEPTH, height: DOOR_W }
  }
}

export interface TileRect { x: number, y: number, width: number, height: number }

// Door cells in footprint-local [x, y] coords. Buildings can have several;
// standing on any of them enters. Falls back to the single-tile and then the
// legacy edge/offset forms.
export function doorLocalTiles(building: Building): number[][] {
  const { tileW, tileH, door } = building
  if (door.tiles?.length) return door.tiles
  if (door.tile) return [door.tile]
  const { edge, offsetTiles } = door
  if (edge === 'north') return [[offsetTiles, 0]]
  if (edge === 'south') return [[offsetTiles, tileH - 1]]
  if (edge === 'east') return [[tileW - 1, offsetTiles]]
  return [[0, offsetTiles]]
}

// World-space rects of all door cells.
export function doorTileRects(building: Building): TileRect[] {
  return doorLocalTiles(building).map(([lx, ly]) => ({
    x: (building.tileX + lx) * TILE_SIZE,
    y: (building.tileY + ly) * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
  }))
}

// Primary door cell (first one) — legacy single-door consumers.
export function doorTilePixels(building: Building): TileRect {
  return doorTileRects(building)[0]
}

// Outward direction of a door cell: from the building center through the
// cell, snapped to the dominant axis. Used for markers, glows, approach
// points, and the push-back when leaving.
export function doorOutwardDirFor(building: Building, rect: TileRect): [number, number] {
  if (!building.door.tiles?.length && !building.door.tile) {
    return ({ north: [0, -1], south: [0, 1], east: [1, 0], west: [-1, 0] } as const)[building.door.edge].slice() as [number, number]
  }
  const dx = rect.x + rect.width / 2 - (building.tileX + building.tileW / 2) * TILE_SIZE
  const dy = rect.y + rect.height / 2 - (building.tileY + building.tileH / 2) * TILE_SIZE
  return Math.abs(dx) >= Math.abs(dy)
    ? [Math.sign(dx) || 1, 0]
    : [0, Math.sign(dy) || 1]
}

export function doorOutwardDir(building: Building): [number, number] {
  return doorOutwardDirFor(building, doorTilePixels(building))
}

// Door marker drawn at the inner edge of a doorway cell (opposite the
// outward direction), so the door sits at the back of the opening.
export function doorInsetFor(building: Building, rect: TileRect): TileRect {
  const [ox, oy] = doorOutwardDirFor(building, rect)
  const DEPTH = 8
  if (oy === 1)  return { x: rect.x, y: rect.y, width: TILE_SIZE, height: DEPTH }
  if (oy === -1) return { x: rect.x, y: rect.y + TILE_SIZE - DEPTH, width: TILE_SIZE, height: DEPTH }
  if (ox === 1)  return { x: rect.x, y: rect.y, width: DEPTH, height: TILE_SIZE }
  return { x: rect.x + TILE_SIZE - DEPTH, y: rect.y, width: DEPTH, height: TILE_SIZE }
}

export function doorInsetPixels(building: Building): TileRect {
  return doorInsetFor(building, doorTilePixels(building))
}

// The point one tile outward of the primary door cell.
export function doorApproachPixels(building: Building) {
  const t = doorTilePixels(building)
  const [ox, oy] = doorOutwardDirFor(building, t)
  return {
    x: t.x + TILE_SIZE / 2 + ox * TILE_SIZE,
    y: t.y + TILE_SIZE / 2 + oy * TILE_SIZE,
  }
}
