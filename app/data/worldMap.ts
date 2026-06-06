import type { TileType } from '~/types/simulation'

// 0 = grass, 1 = path, 2 = water, 3 = wall/blocked
// 40 columns × 30 rows

const G: TileType = 0 // grass
const P: TileType = 1 // path
const W: TileType = 2 // water
const X: TileType = 3 // wall

export const worldMap: TileType[][] = [
  // Row  0
  [G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G],
  // Row  1
  [G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G],
  // Row  2
  [G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, W,W,W,W,W,W,G,G,G,G, G,G,G,G,G,G,G,G,G,G],
  // Row  3
  [G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, W,W,W,W,W,W,G,G,G,G, G,G,G,G,G,G,G,G,G,G],
  // Row  4
  [G,G,X,X,X,X,G,G,G,G, G,G,G,G,G,G,G,G,G,G, W,W,W,W,W,W,G,G,G,G, G,G,G,G,G,G,G,G,G,G],
  // Row  5 — home building rows
  [G,G,X,X,X,X,G,G,G,G, G,G,G,G,G,G,G,G,G,G, W,W,W,W,W,W,G,G,G,G, G,G,G,G,G,G,G,G,G,G],
  // Row  6
  [G,G,X,X,X,X,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G],
  // Row  7
  [G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G],
  // Row  8 — horizontal main path
  [G,P,P,P,P,P,P,P,P,P, P,P,P,P,P,P,P,P,P,P, P,P,P,P,P,P,P,P,P,P, P,P,P,P,P,P,P,P,P,G],
  // Row  9
  [G,P,P,P,P,P,P,P,P,P, P,P,P,P,P,P,P,P,P,P, P,P,P,P,P,P,P,P,P,P, P,P,P,P,P,P,P,P,P,G],
  // Row 10
  [G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G],
  // Row 11
  [G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G],
  // Row 12 — bank & store buildings
  [G,G,G,G,G,G,G,G,G,G, G,X,X,X,X,X,G,G,G,G, G,G,G,G,G,X,X,X,X,G, G,G,G,G,G,G,G,G,G,G],
  // Row 13
  [G,G,G,G,G,G,G,G,G,G, G,X,X,X,X,X,G,G,G,G, G,G,G,G,G,X,X,X,X,G, G,G,G,G,G,G,G,G,G,G],
  // Row 14
  [G,G,G,G,G,G,G,G,G,G, G,X,X,X,X,X,G,G,G,G, G,G,G,G,G,X,X,X,X,G, G,G,G,G,G,G,G,G,G,G],
  // Row 15
  [G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G],
  // Row 16
  [G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G],
  // Row 17 — vertical path down left side
  [G,G,P,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,P,G,G,G,G,G,G],
  // Row 18
  [G,G,P,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,P,G,G,G,G,G,G],
  // Row 19
  [G,G,P,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,P,G,G,G,G,G,G],
  // Row 20
  [G,G,P,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,P,G,G,G,G,G,G],
  // Row 21 — workplace building rows
  [G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,X,X,X,X,X,X,G,G,G],
  // Row 22
  [G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,X,X,X,X,X,X,G,G,G],
  // Row 23
  [G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,X,X,X,X,X,X,G,G,G],
  // Row 24
  [G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,X,X,X,X,X,X,G,G,G],
  // Row 25 — clothing store
  [G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,X,X,X,X, X,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G],
  // Row 26
  [G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,X,X,X,X, X,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G],
  // Row 27
  [G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,X,X,X,X, X,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G],
  // Row 28
  [G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G],
  // Row 29
  [G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G, G,G,G,G,G,G,G,G,G,G],
]
