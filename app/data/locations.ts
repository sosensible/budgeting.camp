import type { Building } from '~/types/simulation'
import { TILE_SIZE } from '~/types/simulation'

export const locations: Building[] = [
  {
    id: 'home',
    name: 'Home',
    tileX: 2, tileY: 4, tileW: 4, tileH: 3,
    color: '#c6a96b',
    scene: 'home',
  },
  {
    id: 'bank',
    name: 'Bank',
    tileX: 11, tileY: 12, tileW: 5, tileH: 3,
    color: '#6baed6',
    scene: 'bank',
  },
  {
    id: 'general-store',
    name: 'General Store',
    tileX: 25, tileY: 12, tileW: 4, tileH: 3,
    color: '#74c476',
    scene: 'general-store',
  },
  {
    id: 'workplace',
    name: 'Workplace',
    tileX: 31, tileY: 21, tileW: 6, tileH: 4,
    color: '#9e9ac8',
    scene: 'workplace',
  },
  {
    id: 'clothing-store',
    name: 'Clothing Store',
    tileX: 16, tileY: 25, tileW: 5, tileH: 3,
    color: '#fc8d59',
    scene: 'clothing-store',
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
