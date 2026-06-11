// Name of the location the resident is currently inside, for scene titles.
// Resolves the exact building entered; falls back to the first building
// serving the scene, then to the provided default.
export function useLocationName(fallback: string) {
  const world = useWorldStore()
  const scenario = useScenarioStore()

  return computed(() => {
    const exact = scenario.buildings.find(b => b.id === world.currentBuildingId)
    if (exact) return exact.name
    const byScene = scenario.buildings.find(b => b.scene === world.currentScene)
    return byScene?.name ?? fallback
  })
}
