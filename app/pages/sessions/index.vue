<script setup lang="ts">
import type { Session } from "~~/types";

const sessionStore = useSessionStore();
await useAsyncData("sessions", () => sessionStore.getTodaysSessions(), {});

const headers: Array<{
  title: string;
  align?: "start" | "end" | "center";
  sortable?: boolean;
  value: string;
}> = [
  {
    title: "Proctor Name",
    align: "start",
    sortable: false,
    value: "proctor",
  },
  { title: "Room #", value: "room", align: "start" },
  { title: "Grade", value: "grade", align: "start", sortable: true },
  { title: "Registered Students", value: "students.length", align: "start" },
  { title: "Capacity", value: "capacity", align: "start" },
  { title: "Status", value: "status", align: "start", sortable: true },
  { title: "Proctor Phone", value: "phone", align: "start" },
];
</script>

<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="sessionStore.sessions"
      class="elevation-1"
      item-key="_id"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Today's Proctor Sessions</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <NuxtLink to="/sessions/admin" class="btn btn-primary"
            ><v-btn color="primary" variant="outlined" class="mr-4">
              <v-icon left>mdi-cog</v-icon>Admin</v-btn
            ></NuxtLink
          >
        </v-toolbar>
      </template>
      <template v-slot:[`item.proctor`]="{ item }">
        <NuxtLink :to="`/sessions/${item._id}`" prefetch>{{
          item.proctor
        }}</NuxtLink>
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <v-chip
          :color="item.status === 'Open' ? 'success' : 'error'"
          variant="tonal"
          size="small"
        >
          <v-icon start size="16">
            {{ item.status === "Open" ? "mdi-progress-check" : "mdi-lock" }}
          </v-icon>
          {{ item.status }}
        </v-chip>
      </template>
    </v-data-table>
  </v-container>
</template>
