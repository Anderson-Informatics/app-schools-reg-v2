<script setup lang="ts">
import type { Session, StudentShort } from "~~/types";

const sessionStore = useSessionStore();
const configStore = useConfigStore();
await useAsyncData("all-sessions", () => sessionStore.getTodaysSessions(), {});
await useAsyncData("config", () => configStore.getConfig(), {});
await useAsyncData("students", () => sessionStore.getTodaysStudents(), {});

console.log("Config data in admin page: ", configStore.config);

const ADMIN_KW = "AppSchools2026";
const isAuthenticated = ref(false);
const kwInput = ref("");
const kwError = ref(false);

const search = ref<string>("");
// Notification variables
const snackbar = ref<boolean>(false);
const snackerror = ref<boolean>(false);
const text_success = ref<string>("");
const text_error = ref<string>(
  "Something went wrong, please refresh the page and try again.",
);
const timeout = 3000;

onMounted(() => {
  const stored = localStorage.getItem("admin_auth");
  if (stored === ADMIN_KW) {
    isAuthenticated.value = true;
  }
});

const submitkw = () => {
  if (kwInput.value === ADMIN_KW) {
    localStorage.setItem("admin_auth", ADMIN_KW);
    isAuthenticated.value = true;
    kwError.value = false;
  } else {
    kwError.value = true;
  }
};

const dialog = ref(false);
const createDialog = ref(false);
const configDialog = ref(false);

const gradeOptions = [
  "IEP",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "3-4",
  "5-6",
  "7-8",
];

const newSession = ref<Partial<Session>>({
  _id: crypto.randomUUID(),
  proctor: "",
  phone: "",
  room: "",
  date: new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeZone: "America/Detroit",
  }).format(new Date()),
  status: "",
  capacity: 0,
  grade: "",
  students: [],
});

const closeCreate = () => {
  createDialog.value = false;
  newSession.value = {
    _id: crypto.randomUUID(),
    proctor: "",
    phone: "",
    room: "",
    date: new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
      timeZone: "America/Detroit",
    }).format(new Date()),
    status: "",
    capacity: 0,
    grade: "",
    students: [],
  };
};

const saveNew = async () => {
  try {
    await sessionStore.createSession(newSession.value);
    sessionStore.sessions.push(newSession.value as Session);
    text_success.value = "Session created successfully!";
    snackbar.value = true;
  } catch (error) {
    console.log(error);
    snackerror.value = true;
  }
  closeCreate();
};

const configId = computed(() => configStore.config?._id);
const editedConfig = ref({ ...configStore.config });

const closeConfig = () => {
  configDialog.value = false;
  editedConfig.value = { ...configStore.config };
};

const saveConfig = async () => {
  try {
    await configStore.updateConfig(editedConfig.value);
  } catch (error) {
    console.log(error);
  }
  configDialog.value = false;
};

const configDisplayNames = {
  g2cap: "Grade 2 Capacity",
  g3cap: "Grade 3 Capacity",
  g4cap: "Grade 4 Capacity",
  g5cap: "Grade 5 Capacity",
  g6cap: "Grade 6 Capacity",
  g7cap: "Grade 7 Capacity",
  g8cap: "Grade 8 Capacity",
  g34cap: "Grade 3-4 Capacity",
  g56cap: "Grade 5-6 Capacity",
  g78cap: "Grade 7-8 Capacity",
  group34: "Combine Grades 3-4",
  group56: "Combine Grades 5-6",
  group78: "Combine Grades 7-8",
};

const editedItem = ref<Partial<Session>>({
  _id: "",
  proctor: "",
  phone: "",
  room: "",
  status: "",
  capacity: 0,
});

const headers: Array<{
  title: string;
  align?: "start" | "end" | "center";
  sortable?: boolean;
  value: string;
}> = [
  { title: "Proctor Name", align: "start", sortable: true, value: "proctor" },
  { title: "Phone", value: "phone", align: "start" },
  { title: "Room #", value: "room", align: "start" },
  { title: "Grade", value: "grade", align: "start" },
  { title: "Date", value: "date", align: "start" },
  { title: "Status", value: "status", align: "start" },
  { title: "Students", value: "students.length", align: "start" },
  { title: "Actions", value: "actions", align: "center", sortable: false },
];

const openEdit = (item: Session) => {
  editedItem.value = {
    _id: item._id,
    proctor: item.proctor,
    phone: item.phone,
    room: item.room,
    status: item.status,
    capacity: item.capacity,
  };
  dialog.value = true;
};

const close = () => {
  dialog.value = false;
  nextTick(() => {
    editedItem.value = {
      _id: "",
      proctor: "",
      phone: "",
      room: "",
      status: "",
      capacity: 0,
    };
  });
};

const save = async () => {
  try {
    console.log("Saving session with data: ", editedItem.value);
    await sessionStore.updateSession(editedItem.value);
    const session = sessionStore.sessions.find(
      (s) => s._id === editedItem.value._id,
    );
    if (session) {
      session.proctor = editedItem.value.proctor ?? "";
      session.phone = editedItem.value.phone ?? "";
      session.room = editedItem.value.room ?? "";
      session.status = editedItem.value.status ?? session.status;
    }
  } catch (error) {
    console.log(error);
  }
  close();
};

const deleteSession = async () => {
  try {
    await sessionStore.deleteSession(editedItem.value._id!);
    sessionStore.sessions = sessionStore.sessions.filter(
      (s) => s._id !== editedItem.value._id,
    );
    text_success.value = "Session deleted successfully!";
    snackbar.value = true;
  } catch (error) {
    console.log(error);
    snackerror.value = true;
  }
  close();
};

const logout = () => {
  window.localStorage.removeItem("admin_auth");
  navigateTo("/sessions");
};

const moveDialog = ref(false);
const moveTargetSessionId = ref<string>("");
const moveOriginSessionId = ref<string>("");
const moveStudent = ref<StudentShort | null>(null);

const openMoveDialog = (item: any) => {
  console.log("Moving student: ", item);
  moveStudent.value = item;
  moveTargetSessionId.value = "";
  moveOriginSessionId.value = item.sessionId || "";
  moveDialog.value = true;
};

const confirmMove = async (payload?: { sessionId: string }) => {
  if (payload?.sessionId) {
    moveTargetSessionId.value = payload.sessionId;
  }
  if (!moveStudent.value || !moveTargetSessionId.value) return;
  try {
    await sessionStore.moveStudent({
      student: moveStudent.value,
      moveTargetSessionId: moveTargetSessionId.value,
      moveOriginSessionId: moveOriginSessionId.value,
    });
    // Update origin session: remove student
    const originSession = sessionStore.sessions.find(
      (s) => s._id === moveOriginSessionId.value,
    );
    if (originSession) {
      originSession.students = originSession.students.filter(
        (s) => s.submissionId !== moveStudent.value!.submissionId,
      );
    }
    // Update target session: add student
    const targetSession = sessionStore.sessions.find(
      (s) => s._id === moveTargetSessionId.value,
    );
    if (targetSession) {
      targetSession.students.push(moveStudent.value!);
    }
    // Update student's sessionLabel in students list
    const studentInList = sessionStore.students.find(
      (s) => s.submissionId === moveStudent.value!.submissionId,
    );
    if (studentInList && targetSession) {
      studentInList.sessionId = moveTargetSessionId.value;
      studentInList.sessionLabel = `${targetSession.proctor} — Room ${targetSession.room} (${targetSession.grade})`;
    }
    text_success.value = "Student moved successfully!";
    snackbar.value = true;
  } catch (error) {
    console.log(error);
    snackerror.value = true;
  }
  moveDialog.value = false;
};
</script>

<template>
  <v-container>
    <!-- kw Gate -->
    <v-row
      v-if="!isAuthenticated"
      justify="center"
      align="center"
      style="min-height: 60vh"
    >
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-4">
          <v-card-title class="text-center">Admin Access</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="kwInput"
              label="Password"
              type="password"
              :error-messages="kwError ? 'Incorrect password' : ''"
              @keyup.enter="submitkw"
              variant="outlined"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="submitkw">Enter</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Admin Content -->
    <template v-else>
      <v-data-table
        :headers="headers"
        :items="sessionStore.sessions"
        class="elevation-1"
        item-key="_id"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>All Proctor Sessions (Admin)</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn
              color="success"
              variant="outlined"
              class="mr-4"
              @click="createDialog = true"
            >
              <v-icon>mdi-plus</v-icon>
              New
            </v-btn>
            <v-dialog v-model="createDialog" max-width="500px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Create New Session</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="6">
                        <v-text-field
                          v-model="newSession.proctor"
                          label="Proctor Name"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-text-field
                          v-model="newSession.phone"
                          label="Proctor Phone"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-text-field
                          v-model="newSession.room"
                          label="Room #"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-select
                          v-model="newSession.status"
                          label="Status"
                          :items="['Open', 'Closed']"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-text-field
                          v-model.number="newSession.capacity"
                          label="Capacity"
                          type="number"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-select
                          v-model="newSession.grade"
                          label="Grade"
                          :items="gradeOptions"
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" @click="closeCreate"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" @click="saveNew">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn
              color="primary"
              variant="outlined"
              class="mr-4"
              @click="configDialog = true"
            >
              <v-icon>mdi-cog</v-icon>
              Config
            </v-btn>
            <v-dialog v-model="configDialog" max-width="600px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Site Configuration</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <template v-for="(value, key) in editedConfig" :key="key">
                        <v-col
                          v-if="
                            key !== '_id' &&
                            key !== 'g34cap' &&
                            key !== 'g56cap' &&
                            key !== 'g78cap'
                          "
                          cols="12"
                          sm="12"
                          md="6"
                        >
                          <v-text-field
                            v-if="typeof value === 'number'"
                            v-model.number="editedConfig[key]"
                            :label="configDisplayNames[key] ?? key"
                            type="number"
                          ></v-text-field>
                          <template v-else-if="typeof value === 'boolean'">
                            <v-switch
                              v-model="editedConfig[key]"
                              :label="configDisplayNames[key] ?? key"
                              :color="editedConfig[key] ? 'primary' : undefined"
                            ></v-switch>
                            <v-text-field
                              v-if="key === 'group34' && editedConfig.group34"
                              v-model.number="editedConfig.g34cap"
                              :label="configDisplayNames['g34cap'] ?? 'g34cap'"
                              type="number"
                            ></v-text-field>
                            <v-text-field
                              v-if="key === 'group56' && editedConfig.group56"
                              v-model.number="editedConfig.g56cap"
                              :label="configDisplayNames['g56cap'] ?? 'g56cap'"
                              type="number"
                            ></v-text-field>
                            <v-text-field
                              v-if="key === 'group78' && editedConfig.group78"
                              v-model.number="editedConfig.g78cap"
                              :label="configDisplayNames['g78cap'] ?? 'g78cap'"
                              type="number"
                            ></v-text-field>
                          </template>
                          <v-text-field
                            v-else
                            v-model="editedConfig[key]"
                            :label="configDisplayNames[key] ?? key"
                          ></v-text-field>
                        </v-col>
                      </template>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" @click="closeConfig"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" @click="saveConfig">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn
              color="error"
              variant="outlined"
              class="mr-4"
              @click="logout"
            >
              <v-icon>mdi-logout</v-icon>
            </v-btn>
            <v-dialog v-model="dialog" max-width="500px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Session Configuration</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="6">
                        <v-text-field
                          v-model="editedItem.proctor"
                          label="Proctor Name"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-text-field
                          v-model="editedItem.phone"
                          label="Proctor Phone"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-text-field
                          v-model="editedItem.room"
                          label="Room #"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-select
                          v-model="editedItem.status"
                          label="Status"
                          :items="['Open', 'Closed']"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="12" md="6">
                        <v-text-field
                          v-model="editedItem.capacity"
                          label="Capacity"
                          type="number"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red darken-1" @click="deleteSession"
                    >Delete</v-btn
                  >
                  <v-btn color="blue darken-1" @click="close">Cancel</v-btn>
                  <v-btn color="blue darken-1" @click="save">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>

        <template v-slot:[`item.proctor`]="{ item }">
          <nuxt-link :to="`/sessions/${item._id}`" prefetch>{{
            item.proctor
          }}</nuxt-link>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon size="small" @click="openEdit(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-data-table>
      <!-- Students Table -->
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
      <v-data-table
        :headers="[
          // @ts-expect-error
          { title: 'submissionId', value: 'submissionId', align: ' d-none' },

          {
            title: 'submissionIdInt',
            value: 'submissionIdInt',
            // @ts-expect-error
            align: ' d-none',
          },
          { title: 'Name', value: 'FullName', align: 'start', sortable: true },
          { title: 'Grade', value: 'GradeEntering', align: 'start' },
          { title: 'Session', value: 'sessionLabel', align: 'start' },
          { title: 'First', value: 'FirstName', align: 'start' },
          { title: 'Last', value: 'LastName', align: 'start' },
          { title: 'Move', value: 'move', align: 'center', sortable: false },
        ]"
        :items="sessionStore.students"
        class="elevation-1 mt-6"
        item-key="_id"
        :search="search"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>All Students Today</v-toolbar-title>
          </v-toolbar>
        </template>

        <template v-slot:[`item.move`]="{ item }">
          <v-btn icon size="small" @click="openMoveDialog(item)">
            <v-icon>mdi-swap-horizontal</v-icon>
          </v-btn>
        </template>
      </v-data-table>

      <SessionSelectModal
        v-model="moveDialog"
        v-model:selected-session-id="moveTargetSessionId"
        :sessions="sessionStore.sessions"
        :exclude-session-id="moveOriginSessionId"
        title="Move Student"
        label="Select Target Session"
        confirm-text="Move"
        @confirm="confirmMove"
      />
      <v-snackbar v-model="snackbar" :timeout="timeout" color="green" top>
        {{ text_success }}

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
    </template>
  </v-container>
</template>
