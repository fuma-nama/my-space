// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
  tailwindcss: {
    cssPath: "./assets/css/tailwind.css",
  },
  runtimeConfig: {
    public: {
      geoapifyApiKey: "670855cd55a942d2a592d1703be68848",
    },
  },
  devtools: { enabled: true },
});
