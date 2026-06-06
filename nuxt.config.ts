// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  app: {
    head: {
      title: 'Budgeting Camp',
      meta: [{ name: 'description', content: 'A life simulation for practicing real financial decisions' }],
    },
  },
})
