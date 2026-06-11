import type { BuildingType } from '~/types/simulation'

// Building type registry: one meta file per type in scenario/building-types/.
const modules = import.meta.glob('../../scenario/building-types/*.json', { eager: true })

export const BUILDING_TYPES: Record<string, BuildingType> = {}
for (const mod of Object.values(modules)) {
  const meta = (mod as { default: BuildingType }).default
  BUILDING_TYPES[meta.id] = meta
}

export const BUILDING_TYPE_LIST = Object.values(BUILDING_TYPES)
  .sort((a, b) => a.name.localeCompare(b.name))
