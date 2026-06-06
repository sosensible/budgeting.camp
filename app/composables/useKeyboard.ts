export function useKeyboard() {
  const keys = reactive({
    up: false,
    down: false,
    left: false,
    right: false,
    interact: false,
  })

  const keyMap: Record<string, keyof typeof keys> = {
    ArrowUp: 'up', KeyW: 'up',
    ArrowDown: 'down', KeyS: 'down',
    ArrowLeft: 'left', KeyA: 'left',
    ArrowRight: 'right', KeyD: 'right',
    KeyE: 'interact',
  }

  function onKeyDown(e: KeyboardEvent) {
    const action = keyMap[e.code]
    if (action) { keys[action] = true; e.preventDefault() }
  }

  function onKeyUp(e: KeyboardEvent) {
    const action = keyMap[e.code]
    if (action) keys[action] = false
  }

  onMounted(() => window.addEventListener('keydown', onKeyDown))
  onMounted(() => window.addEventListener('keyup', onKeyUp))
  onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
  onUnmounted(() => window.removeEventListener('keyup', onKeyUp))

  return { keys }
}
