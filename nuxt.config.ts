// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  nitro: {
    plugins: ["~~/server/plugins/mongodb.ts"],
  },
  ssr: false,
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "@pinia/nuxt",
    //...
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  app: {
    head: {
      link: [{ rel: "icon", type: "image/x-icon", href: "favicon.ico" }],
      script: [{ src: "dymo.connect.framework.full.js" }],
      //script: [{ src: "DYMO.Label.Framework.3.0.js" }],
    },
  },
  runtimeConfig: {
    MONGO_URI: process.env.MONGO_URI,
    API_URL: process.env.API_URL,
    SUBMITTABLE_API_KEY: process.env.SUBMITTABLE_API_KEY,
  },
});
