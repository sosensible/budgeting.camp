// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  components: [{ path: '~/components', pathPrefix: false }],
  app: {
    head: {
      title: 'Budgeting Camp',
      meta: [{ name: 'description', content: 'A life simulation for practicing real financial decisions' }],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', type: 'image/png', href: '/icon.png', sizes: '512x512' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    },
  },
})
