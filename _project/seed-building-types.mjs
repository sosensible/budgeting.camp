// One-off: create scenario/building-types/*.json from the alpha-4 buildings
// and tag each alpha-4 instance with its type id.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

const TYPES = {
  'home-tent': {
    name: 'Home Tent',
    description: 'The resident\'s home tent. Rest and start the day here.',
    match: b => b.scene === 'home-tent',
  },
  'market': {
    name: 'Market Stall',
    description: 'Groceries and staples for day-to-day living.',
    match: b => b.scene === 'market',
  },
  'supply': {
    name: 'Supply Shop',
    description: 'Camp gear and essentials.',
    match: b => b.scene === 'supply-tent',
  },
  'bank': {
    name: 'Camp Bank',
    description: 'Checking and savings; move money between accounts.',
    match: b => b.scene === 'bank',
  },
  'diner': {
    name: 'Open-Air Diner',
    description: 'Hot meals served all day.',
    match: b => b.scene === 'diner',
  },
  'workplace': {
    name: 'Workplace',
    description: 'Collect the weekly paycheck here.',
    match: b => b.scene === 'workshop',
  },
}

const path = 'scenario/alpha-4/scenario.json'
const s = JSON.parse(readFileSync(path))
mkdirSync('scenario/building-types', { recursive: true })

for (const [id, t] of Object.entries(TYPES)) {
  const sample = s.buildings.find(t.match)
  if (!sample) { console.warn('no sample for', id); continue }
  const doorTiles = sample.door.tiles
    ?? (sample.door.tile ? [sample.door.tile] : null)
    ?? (() => {
      const { edge, offsetTiles } = sample.door
      if (edge === 'north') return [[offsetTiles, 0]]
      if (edge === 'south') return [[offsetTiles, sample.tileH - 1]]
      if (edge === 'east') return [[sample.tileW - 1, offsetTiles]]
      return [[0, offsetTiles]]
    })()
  const meta = {
    id,
    name: t.name,
    description: t.description,
    scene: sample.scene,
    image: sample.image,
    color: sample.color,
    tileW: sample.tileW,
    tileH: sample.tileH,
    door: { tiles: doorTiles },
    openTiles: sample.openTiles ?? [],
  }
  writeFileSync(`scenario/building-types/${id}.json`, JSON.stringify(meta, null, 2) + '\n')
  console.log('wrote', id)
}

// tag instances
for (const b of s.buildings) {
  for (const [id, t] of Object.entries(TYPES)) {
    if (t.match(b)) { b.type = id; break }
  }
}
let json = JSON.stringify(s, null, 2)
json = json.replace(/\[\n(\s+[\d,\n\s]+?)\n\s*\]/g, (_m, inner) => '[' + inner.replace(/\s+/g, '') + ']')
writeFileSync(path, json)
console.log('tagged', s.buildings.filter(b => b.type).length, 'of', s.buildings.length, 'instances')
