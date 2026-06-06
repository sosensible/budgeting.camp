export function useSimLoop(tick: () => void) {
  let rafId: number | null = null

  function loop() {
    tick()
    rafId = requestAnimationFrame(loop)
  }

  onMounted(() => { rafId = requestAnimationFrame(loop) })
  onUnmounted(() => { if (rafId !== null) cancelAnimationFrame(rafId) })
}
