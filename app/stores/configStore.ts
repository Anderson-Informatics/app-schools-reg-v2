import { defineStore } from 'pinia';
import type { Config } from '~~/types';

export const useConfigStore = defineStore('config-store', {
  state: () => ({
    // list all results
    config: {} as Config,  
  }),
  actions: {
    // Get all results from DB
    async getConfig() {
      try {
        let data = await $fetch<Config>('/api/config');
        this.config = data;
        return data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async updateConfig(payload: Object) {
      try {
        await $fetch('/api/config/update', {
          method: 'POST',
          body: payload,
        });
      } catch (e: any) {
        console.log(e.message);
      }
    },
  },
});
