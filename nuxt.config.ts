// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    layoutTransition: {
      name: "layout",
      mode: "out-in",
    },
  },
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "nuxt-file-storage",
    "@nuxt/ui",
    "@nuxtjs/tailwindcss",
    "@nuxt/fonts",
  ],
  colorMode: {
    preference: "light",
  },
});
