const WALK_THROTTLE = 0.55  // arrow keys alone = walk
const RUN_THROTTLE = 1      // hold Shift to run

export function useKeyboard() {
  const input = useInputStore()
  const { keys } = input

  const keyMap: Record<string, keyof typeof keys> = {
    ArrowUp: 'up', KeyW: 'up',
    ArrowDown: 'down', KeyS: 'down',
    ArrowLeft: 'left', KeyA: 'left',
    ArrowRight: 'right', KeyD: 'right',
    KeyE: 'interact',
  }

  function applyThrottle(shift: boolean) {
    input.throttle = shift ? RUN_THROTTLE : WALK_THROTTLE
  }

  function onKeyDown(e: KeyboardEvent) {
    // Ctrl+F toggles door location hints (desktop)
    if (e.ctrlKey && e.code === 'KeyF') {
      input.showDoorHints = !input.showDoorHints
      e.preventDefault()
      return
    }
    const action = keyMap[e.code]
    if (action) { keys[action] = true; e.preventDefault() }
    if (action || e.key === 'Shift') applyThrottle(e.shiftKey)
  }

  function onKeyUp(e: KeyboardEvent) {
    const action = keyMap[e.code]
    if (action) keys[action] = false
    if (action || e.key === 'Shift') applyThrottle(e.shiftKey)
  }

  onMounted(() => window.addEventListener('keydown', onKeyDown))
  onMounted(() => window.addEventListener('keyup', onKeyUp))
  onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
  onUnmounted(() => window.removeEventListener('keyup', onKeyUp))

  return { keys }
}
