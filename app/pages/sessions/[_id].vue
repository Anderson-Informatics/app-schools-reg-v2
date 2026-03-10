<script setup lang="ts">
const route = useRoute();
const sessionStore = useSessionStore();

// Define the type for the payload object
interface StudentPayload {
  sid: string;
  student: StudentShort;
  session: {
    _id: string;
    proctor: string;
    room: string;
    wing: string;
    start: string;
  };
}

// Ensure sessionStore.session.students is typed as an array of Student
import type { Session, StudentShort } from "~~/types"; // Adjust the path to where the Session and StudentShort types are defined

const session = sessionStore.session as Session;
await useAsyncData(
  "session",
  () =>
    sessionStore.getOne(
      (Array.isArray(route.params._id)
        ? route.params._id[0]
        : route.params._id) || "",
    ),
  {},
);

const routeId = route.params._id;

const search = ref("");
const headers = [
  { title: "Login ID", value: "submissionIdInt" },
  {
    title: "Full Name",
    align: "start" as "start",
    sortable: true,
    value: "FullName",
  },
  {
    title: "Grade",
    value: "GradeEntering",
    align: "start" as "start",
    sortable: true,
  },
  { title: "First Name", value: "FirstName", sortable: true },
  { title: "Last Name", value: "LastName", sortable: true },
];

// This will enable polling to refresh the student list every 10 seconds
let polling: number | undefined = undefined;

const refresh = () => {
  console.log("Polling...");
  sessionStore.getOne(
    (Array.isArray(route.params._id)
      ? route.params._id[0]
      : route.params._id) || "",
  );
};

onMounted(() => {
  polling = window.setInterval(refresh, 120000);
});

onUnmounted(() => {
  window.clearInterval(polling);
});
</script>

<template>
  <v-container>
    <h1>CogAT Proctor Session Information</h1>
    <template v-if="sessionStore.session">
      <v-card class="mb-6" elevation="2" rounded="lg">
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="6">
              <v-list density="comfortable" bg-color="transparent">
                <v-list-item>
                  <template #prepend>
                    <v-icon color="primary">mdi-account-tie</v-icon>
                  </template>
                  <v-list-item-title class="text-medium-emphasis"
                    >Proctor</v-list-item-title
                  >
                  <v-list-item-subtitle class="text-h6">{{
                    sessionStore.session.proctor
                  }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template #prepend>
                    <v-icon color="primary">mdi-calendar</v-icon>
                  </template>
                  <v-list-item-title class="text-medium-emphasis"
                    >Date</v-list-item-title
                  >
                  <v-list-item-subtitle class="text-h6">{{
                    sessionStore.session.date
                  }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>

            <v-col cols="12" md="6">
              <v-list density="comfortable" bg-color="transparent">
                <v-list-item>
                  <template #prepend>
                    <v-icon color="primary">mdi-school</v-icon>
                  </template>
                  <v-list-item-title class="text-medium-emphasis"
                    >Grade</v-list-item-title
                  >
                  <v-list-item-subtitle class="text-h6">{{
                    sessionStore.session.grade
                  }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template #prepend>
                    <v-icon color="primary">mdi-map-marker</v-icon>
                  </template>
                  <v-list-item-title class="text-medium-emphasis"
                    >Location</v-list-item-title
                  >
                  <v-list-item-subtitle class="text-h6"
                    >Room {{ sessionStore.session.room }}</v-list-item-subtitle
                  >
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <v-row class="mb-2" dense>
            <v-col
              cols="12"
              md="6"
              class="d-flex align-center ga-3 mb-2 mb-md-0"
            >
              <span class="text-subtitle-1 font-weight-medium">Status</span>
              <v-chip
                :color="
                  sessionStore.session.status === 'Open'
                    ? 'success'
                    : 'grey-darken-1'
                "
                variant="elevated"
                size="large"
              >
                <v-icon start>
                  {{
                    sessionStore.session.status === "Open"
                      ? "mdi-progress-check"
                      : "mdi-lock-check"
                  }}
                </v-icon>
                {{
                  sessionStore.session.status === "Open"
                    ? "Registration in Progress"
                    : "Registration Closed - Proceed with Testing"
                }}
              </v-chip>
            </v-col>

            <v-col cols="12" md="6">
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-subtitle-1 font-weight-medium">Capacity</span>
                <span class="text-body-2">
                  {{ sessionStore.session.students?.length || 0 }} /
                  {{ sessionStore.session.capacity ?? 0 }} registered
                </span>
              </div>

              <v-progress-linear
                :model-value="
                  sessionStore.session.capacity
                    ? ((sessionStore.session.students?.length || 0) /
                        sessionStore.session.capacity) *
                      100
                    : 0
                "
                :color="
                  (sessionStore.session.students?.length || 0) >=
                  (sessionStore.session.capacity ?? 0)
                    ? 'error'
                    : 'primary'
                "
                height="14"
                rounded
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card>
        <v-card-title>
          <template v-slot>
            <v-text-field
              v-model="search"
              placeholder="Search (use Submission ID or least common name, NOT full name)"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              text
              hide-details
              single-line
            >
            </v-text-field>
          </template>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="sessionStore.session.students"
          :search="search"
          :items-per-page="25"
        >
        </v-data-table>
        <!-- Maybe use button for something else
      <template v-slot:[`item.controls`]="props">
          <v-btn
            class="mx-2"
            fab
            dark
            small
            color="green"
            @click="addStudent(props.item)"
          >
            <v-icon dark>mdi-account-plus</v-icon>
          </v-btn>
        </template>
      -->
      </v-card>
    </template>
  </v-container>
</template>
