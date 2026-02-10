<template>
  <v-app theme="dark">
    <NuxtLoadingIndicator />
    <v-card>
      <v-layout>
        <v-navigation-drawer v-model="drawer" expand-on-hover rail>
          <v-list density="compact" nav>
            <v-list-item v-for="item in items" :prepend-icon="item.icon" :title="item.title" :value="item.to" router
              :to="item.to">
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-main style="min-height: 100vh">
          <NuxtPage />
        </v-main>
      </v-layout>
    </v-card>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      rail: true,
      items: [
        {
          icon: 'mdi-home-city',
          title: 'Start Page',
          to: '/',
        },
        {
          icon: 'mdi-alarm',
          title: 'Status',
          to: '/status',
        },
        {
          icon: 'mdi-account-check',
          title: 'Registration',
          to: '/registration',
        },
      ],
    };
  },
};
</script>
