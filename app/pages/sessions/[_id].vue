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
  { text: "Submission ID", value: "submissionIdInt" },
  {
    text: "Full Name",
    align: "start" as "start",
    filterable: false,
    value: "FullName",
  },
  { text: "First Name", value: "FirstName" },
  { text: "Last Name", value: "LastName" },
  //{ text: "Check In Date", value: "CheckIn.Date" },
  //{ text: "Check In Time", value: "CheckIn.Time" },
  //{ text: "Add", value: "controls", sortable: false },
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
    <h1>Proctor Session Information</h1>
    <template v-if="sessionStore.session">
      <h3>Proctor: {{ sessionStore.session.proctor }}</h3>
      <h3>Date: {{ sessionStore.session.date }}</h3>
      Grade: {{ sessionStore.session.grade }}<br />
      Location: {{ sessionStore.session.room }}<br />
      <div v-if="sessionStore.session.status == 'Open'">
        Status: Registration in Progress
      </div>
      <div v-else>Status: Registration Closed - Proceed with Testing</div>
      <br />
      <span></span>
      <span></span>
      <br />
      <br />
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
