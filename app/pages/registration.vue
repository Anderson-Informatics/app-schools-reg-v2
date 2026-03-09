<script setup lang="ts">
import type { Student } from "~~/types"; // Adjust the path to where the Student type is defined
import type { DataTableHeader } from "vuetify";

const studentStore = useStudentStore();
const sessionStore = useSessionStore();
const configStore = useConfigStore();
await useAsyncData("students", () => studentStore.getAll(), {});
await useAsyncData(
  "todays-sessions",
  () => sessionStore.getTodaysSessions(),
  {},
);
await useAsyncData("config", () => configStore.getConfig(), {});

const search = ref<string>("");
const snackbar = ref<boolean>(false);
const snackerror = ref<boolean>(false);
const registrant = ref<string>("");
const text_success = ref<string>(" has been successfully registered.");
const text_error = ref<string>(
  "Something went wrong, please refresh the page and try again.",
);
const timeout = 3000;
const rePrint = ref<boolean>(true);
const sessionSelectDialog = ref(false);
const selectedSessionId = ref("");
const pendingStudentRegistration = ref<{
  submissionId: string;
  submissionIdInt: string;
  FullName: string;
  FirstName: string;
  LastName: string;
  GradeEntering: string;
} | null>(null);

const hasIep = (student: Student) => ["Yes", "MLL", "SD"].includes(student.IEP);
const headers: DataTableHeader[] = [
  {
    title: "Name",
    align: "start",
    sortable: false,
    value: "FullName",
  },
  { title: "Grade", value: "GradeEntering", sortable: true },
  { title: "IEP", value: "IEP", sortable: true },
  { title: "First", sortable: true, value: "FirstName" },
  { title: "Last", sortable: true, value: "LastName" },
  { title: "Session", value: "Session" },
  { title: "ID", value: "submissionIdInt" },

  // @ts-expect-error
  { title: "NewID", value: "submissionId", align: " d-none" },
  // @ts-expect-error
  { title: "Accommodations", value: "Accommodations", align: " d-none" },
  // @ts-expect-error
  { title: "Data Sheet", value: "Data_Sheet", align: " d-none" },
  // @ts-expect-error
  { title: "DOB", value: "DOB", align: " d-none" },
  { title: "Registration Date", value: "CheckIn.Date", sortable: true },
  { title: "Registration Time", value: "CheckIn.Time", sortable: true },
  { title: "Register", value: "controls", sortable: false },
];

const checkIn = (item: Student) => {
  // Check if the student has already registered then prompt the user to confirm if they want to register again
  if (configStore.config?.printLabels) {
    if (typeof item.CheckIn === "object" && item.CheckIn.Registered) {
      let reRegister = confirm(
        "This student appears to have already registered, are you sure would like to register this student?",
      );
      if (reRegister) {
      } else {
        rePrint.value = false;
        return;
      }
    }
  }

  let now = new Date();
  let checkinData = {
    submissionId: item.submissionId,
    submissionIdInt: item.submissionIdInt,
    CheckIn: {
      Date: now.toDateString(),
      Time: now.toLocaleTimeString(),
      Timestamp: now.toISOString(),
      Registered: true,
    },
  };
  try {
    // Check in the student and add them to the session in the store,
    // then update the local student object with the new check-in data
    // to avoid having to refresh the page to see the change
    studentStore.checkInOne(checkinData);
    if (["2", "3", "4", "5", "6", "7", "8"].includes(item.GradeEntering)) {
      let studentRegistrationData = {
        submissionId: item.submissionId,
        submissionIdInt: item.submissionIdInt,
        FullName: item.FullName,
        FirstName: item.FirstName,
        LastName: item.LastName,
        GradeEntering: item.GradeEntering,
      };
      if (hasIep(item)) {
        pendingStudentRegistration.value = studentRegistrationData;
        selectedSessionId.value = "";
        sessionSelectDialog.value = true;
      } else {
        studentStore.addToSession(studentRegistrationData);
      }
    }
    const student = studentStore.students.find(
      (each: any) => each.submissionId === item.submissionId,
    ) as Student | undefined;
    console.log(student);
    if (student) {
      student.CheckIn = checkinData.CheckIn;
      if (configStore.config?.applyLabels) {
        studentStore.addLabel(item);
      }
      registrant.value = item.FullName;
      snackbar.value = true;
    } else {
      console.log("Student not found in store after check-in.");
      snackerror.value = true;
    }
  } catch (error) {
    console.log(error);
    return (snackerror.value = true);
  }
};

const confirmIepSessionSelection = async (payload: { sessionId: string }) => {
  if (!pendingStudentRegistration.value || !payload.sessionId) {
    return;
  }
  try {
    await studentStore.addToSelectedSession({
      sessionId: payload.sessionId,
      student: pendingStudentRegistration.value,
    });
    await sessionStore.getTodaysSessions();
  } catch (error) {
    console.log(error);
    snackerror.value = true;
  } finally {
    sessionSelectDialog.value = false;
    selectedSessionId.value = "";
    pendingStudentRegistration.value = null;
  }
};

const cancelIepSessionSelection = () => {
  sessionSelectDialog.value = false;
  selectedSessionId.value = "";
  pendingStudentRegistration.value = null;
};

const print = (item: Student) => {
  if (configStore.config?.printLabels) {
    if (["2"].includes(item.GradeEntering)) {
      return;
    } else {
      if (rePrint.value) {
        console.log(item);
        printIep(item);
        printLabel(item);
        //printPhone(item);
      } else {
        rePrint.value = true;
      }
    }
  } else {
    return;
  }
};
</script>

<template>
  <v-container>
    <v-card title="Registration" flat>
      <template v-slot:text>
        <v-text-field
          v-model="search"
          placeholder="Search (use least common name, NOT full name)"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          text
          hide-details
          single-line
        >
        </v-text-field>
      </template>

      <v-data-table
        :headers="headers"
        :items="(studentStore.students as Student[]) ?? []"
        :search="search"
      >
        <template v-slot:item.FirstName="{ item }">
          <span class="first-name">{{ item.FirstName }}</span>
        </template>
        <template v-slot:item.LastName="{ item }">
          <span class="last-name">{{ item.LastName }}</span>
        </template>
        <template v-slot:item.IEP="{ item }">
          <div v-if="item.IEP === 'Yes'">
            <v-chip color="warning" dark>
              <span class="iep">{{ item.IEP }}</span>
            </v-chip>
          </div>
          <div v-else-if="item.IEP === 'MLL'">
            <v-chip color="primary" dark>
              <span class="iep">{{ item.IEP }}</span>
            </v-chip>
          </div>
          <div v-else-if="item.IEP === 'SD'">
            <v-chip color="primary" dark>
              <span class="iep">{{ item.IEP }}</span>
            </v-chip>
          </div>
          <div v-else>
            <span class="iep">{{ item.IEP }}</span>
          </div>
        </template>
        <template v-slot:item.Accommodations="{ item }">
          <span class="accommodations">{{ item.Accommodations }}</span>
        </template>
        <template v-slot:item.Data_Sheet="{ item }">
          <span class="data-sheet">{{ item.Data_Sheet }}</span>
        </template>
        <template v-slot:item.submissionIdInt="{ item }">
          <span class="submission-id">
            <a
              :href="
                'https://dpscd.submittable.com/submissions/' +
                item.submissionIdInt
              "
              target="_blank"
              style="color: #aed6fc; text-decoration: none"
            >
              {{ item.submissionIdInt }}
            </a>
          </span>
        </template>
        <template v-slot:item.submissionIdUnique="{ item }">
          <span class="submission-id-unique">{{ item.submissionId }}</span>
        </template>
        <template v-slot:item.controls="{ item }">
          <v-btn
            class="mx-2"
            fab
            dark
            small
            color="green"
            @click="
              checkIn(item);
              print(item);
            "
          >
            <v-icon dark>mdi-account-check</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-snackbar v-model="snackbar" :timeout="timeout" color="green" top>
      {{ registrant }}{{ text_success }}

      <template v-slot:actions>
        <v-btn color="white" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="snackerror" :timeout="timeout" color="red" top>
      {{ text_error }}

      <template v-slot:actions>
        <v-btn color="white" @click="snackerror = false"> Close </v-btn>
      </template>
    </v-snackbar>
    <SessionSelectModal
      v-model="sessionSelectDialog"
      v-model:selected-session-id="selectedSessionId"
      :sessions="sessionStore.sessions"
      :only-open="true"
      title="Select Session for IEP Student"
      label="Target Session"
      confirm-text="Assign"
      @confirm="confirmIepSessionSelection"
      @cancel="cancelIepSessionSelection"
    />
  </v-container>
</template>
