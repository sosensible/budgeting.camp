export function useSimLoop(tick: (deltaMs: number) => void) {
  let rafId: number | null = null
  let lastTime: number | null = null

  function loop(timestamp: number) {
    const deltaMs = lastTime !== null ? timestamp - lastTime : 0
    lastTime = timestamp
    tick(deltaMs)
    rafId = requestAnimationFrame(loop)
  }

  onMounted(() => { rafId = requestAnimationFrame(loop) })
  onUnmounted(() => { if (rafId !== null) cancelAnimationFrame(rafId) })
}
