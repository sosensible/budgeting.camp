<script setup lang="ts">
const route    = useRoute()
const router   = useRouter()
const scenario = useScenarioStore()
const finance  = useFinanceStore()
const resident = useResidentStore()
const simTime  = useSimTimeStore()
const world    = useWorldStore()

const scenarioId = (route.query.id as string) || 'alpha-1'
scenario.load(scenarioId)
finance.init(scenario.data.finance)
resident.init(scenario.data.resident)
simTime.init(scenario.data.simTime)
world.reset()

const sceneMap: Record<string, ReturnType<typeof resolveComponent>> = {
  'home':           resolveComponent('HomeScene'),
  'workplace':      resolveComponent('WorkScene'),
  'bank':           resolveComponent('BankScene'),
  'general-store':  resolveComponent('GeneralStoreScene'),
  'clothing-store': resolveComponent('ClothingStoreScene'),
  // alpha-2
  'home-tent':      resolveComponent('HomeScene'),
  'workshop':       resolveComponent('WorkScene'),
  'market':         resolveComponent('GenericStoreScene'),
  'diner':          resolveComponent('GenericStoreScene'),
  'supply-tent':    resolveComponent('GenericStoreScene'),
}

function exitToSelector() {
  world.reset()
  router.push('/')
}

// no text selection / long-press callout while playing (joystick drags
// otherwise select HUD text and canvas on touch devices)
useHead({ bodyAttrs: { class: 'sim-noselect' } })
</script>

<template>
  <ClientOnly>
    <SimulatorStage />
    <SimHUD @exit="exitToSelector" />
    <TouchControls v-if="world.currentScene === 'overworld'" />
    <component :is="sceneMap[world.currentScene]" v-if="world.currentScene !== 'overworld'" />
  </ClientOnly>
</template>

<style>
body.sim-noselect {
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  overscroll-behavior: none;
}
</style>
