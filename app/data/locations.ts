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

// The point in world-space just outside the door where the resident stands to enter.
export function doorApproachPixels(building: Building) {
  const { tileX, tileY, tileW, tileH, door: { edge, offsetTiles } } = building
  switch (edge) {
    case 'north': return { x: (tileX + offsetTiles) * TILE_SIZE + TILE_SIZE / 2, y: tileY * TILE_SIZE - TILE_SIZE / 2 }
    case 'south': return { x: (tileX + offsetTiles) * TILE_SIZE + TILE_SIZE / 2, y: (tileY + tileH) * TILE_SIZE + TILE_SIZE / 2 }
    case 'east':  return { x: (tileX + tileW) * TILE_SIZE + TILE_SIZE / 2, y: (tileY + offsetTiles) * TILE_SIZE + TILE_SIZE / 2 }
    case 'west':  return { x: tileX * TILE_SIZE - TILE_SIZE / 2,            y: (tileY + offsetTiles) * TILE_SIZE + TILE_SIZE / 2 }
  }
}
