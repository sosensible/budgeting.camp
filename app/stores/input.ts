// Shared movement input flags. Written by the keyboard composable and the
// touch joystick; read by useResident. Keeping it in one store means any
// input device drives the same movement/door logic.
export const useInputStore = defineStore('input', () => {
  const keys = reactive({
    up: false,
    down: false,
    left: false,
    right: false,
    interact: false,
  })

  // 0..1 speed scale; keyboard is always 1, the joystick sets it from
  // how far the knob is pushed (analog movement)
  const throttle = ref(1)

  // desktop: door halos hidden until toggled with Ctrl+F
  const showDoorHints = ref(false)

  function clearMovement() {
    keys.up = false
    keys.down = false
    keys.left = false
    keys.right = false
    throttle.value = 1
  }

  return { keys, throttle, showDoorHints, clearMovement }
})
