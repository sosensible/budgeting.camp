// True on phone-sized displays: small viewport, or a touch device whose
// screen is phone-sized. Used to gate features that need room (the editor).
export function useIsPhone() {
  const isPhone = ref(false)

  function check() {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const smallScreen = Math.min(window.screen.width, window.screen.height) < 768
    isPhone.value = window.innerWidth < 900 || (coarse && smallScreen)
  }

  onMounted(() => {
    check()
    window.addEventListener('resize', check)
  })
  onUnmounted(() => window.removeEventListener('resize', check))

  return isPhone
}
