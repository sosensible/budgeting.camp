import type { Ref } from 'vue'

// Loads an image URL into an HTMLImageElement ref for use in v-image configs.
export function useKonvaImage(src: Ref<string | null> | (() => string | null)) {
  const srcRef = typeof src === 'function' ? computed(src) : src
  const image = ref<HTMLImageElement | null>(null)

  watch(srcRef, (url) => {
    image.value = null
    if (!url || !import.meta.client) return
    const img = new Image()
    img.onload = () => { if (srcRef.value === url) image.value = img }
    img.src = url
  }, { immediate: true })

  return image
}
