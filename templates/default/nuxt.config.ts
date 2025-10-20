export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],
  modules: ['@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  routeRules: {
    // redirects - default root pages
    '/docs': { redirect: '/docs/getting-started', prerender: false },
  },
  compatibilityDate: 'latest'
})
