// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  nitro: {
    plugins: ["~/server/plugins/mongodb.ts"],
  },
  runtimeConfig: {
    MONGO_URI: process.env.MONGO_URI,
    API_URL: process.env.API_URL,
    SUBMITTABLE_API_KEY: process.env.SUBMITTABLE_API_KEY,
  },
});
