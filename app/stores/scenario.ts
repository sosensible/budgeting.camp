import type { Building, TileType } from '~/types/simulation'
import alpha1 from '../../scenario/alpha-1/scenario.json'
import alpha2 from '../../scenario/alpha-2/scenario.json'
import alpha3 from '../../scenario/alpha-3/scenario.json'

export interface ScenarioWorld {
  tileSize: number
  cols: number
  rows: number
}

export interface ScenarioResident {
  spawnTileX: number
  spawnTileY: number
  speed: number
}

export interface ScenarioFinance {
  startingChecking: number
  startingSavings: number
  paycheckAmount: number
  paycheckCycleDays: number
}

export interface ScenarioSimTime {
  startHour: number
  startMinute: number
  simMinutesPerRealSecond: number
}

export interface ScenarioStoreItem {
  id: string
  name: string
  price: number
  description: string
}

export interface ScenarioData {
  id: string
  name: string
  world: ScenarioWorld
  background?: string  // full-map backdrop image URL; tiles render only when absent
  avatar?: string      // HUD avatar portrait URL
  tilemap: TileType[][]
  buildings: Building[]
  stores: Record<string, ScenarioStoreItem[]>
  resident: ScenarioResident
  finance: ScenarioFinance
  simTime: ScenarioSimTime
}

const SCENARIOS: Record<string, ScenarioData> = {
  'alpha-1': alpha1 as unknown as ScenarioData,
  'alpha-2': alpha2 as unknown as ScenarioData,
  'alpha-3': alpha3 as unknown as ScenarioData,
}

export const SCENARIO_CATALOG = Object.values(SCENARIOS).map(s => ({
  id:               s.id,
  name:             s.name,
  startingChecking: s.finance.startingChecking,
  startingSavings:  s.finance.startingSavings,
  weeklyPay:        s.finance.paycheckAmount,
  locationCount:    s.buildings.length,
}))

export const useScenarioStore = defineStore('scenario', () => {
  const data = ref<ScenarioData>(SCENARIOS['alpha-1'])

  function load(id: string) {
    if (!SCENARIOS[id]) throw new Error(`Unknown scenario: ${id}`)
    data.value = SCENARIOS[id]
  }

  const world      = computed(() => data.value.world)
  const background = computed(() => data.value.background ?? null)
  const tilemap    = computed(() => data.value.tilemap)
  const buildings  = computed(() => data.value.buildings)

  return { data, load, world, background, tilemap, buildings }
})
