<template>
  <v-container>
    <v-card title="Registration" flat>
      <template v-slot:text>
        <v-text-field v-model="search" placeholder="Search (use least common name, NOT full name)"
          prepend-inner-icon="mdi-magnify" variant="outlined" text hide-details single-line>
        </v-text-field>
      </template>

      <v-data-table :headers="headers" :items="studentStore.students" :search="search">
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
          <span class="accommodations">{{
            item.Accommodations
          }}</span>
        </template>
        <template v-slot:item.Data_Sheet="{ item }">
          <span class="data-sheet">{{ item.Data_Sheet }}</span>
        </template>
        <template v-slot:item.submissionIdInt="{ item }">
          <span class="submission-id">
            <a :href="'https://dpscd.submittable.com/submissions/' + item.submissionIdInt
              " target="_blank" style="color: #aed6fc; text-decoration: none">
              {{ item.submissionIdInt }}
            </a>
          </span>
        </template>
        <template v-slot:item.submissionIdUnique="{ item }">
          <span class="submission-id-unique">{{
            item.submissionId
          }}</span>
        </template>
        <template v-slot:item.controls="{ item }">
          <v-btn class="mx-2" fab dark small color="green" @click="
            checkIn(item);
          print(item);
          ">
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
  </v-container>
</template>

<script setup lang="ts">
const studentStore = useStudentStore();
await useAsyncData('students', () => studentStore.getAll(), {});

const search = ref('');
const snackbar = ref(false);
const snackerror = ref(false);
const registrant = ref('');
const text_success = ref(' has been successfully registered.');
const text_error = ref(
  'Something went wrong, please refresh the page and try again.',
);
const timeout = 3000;
const rePrint = ref(true);
const headers = [
  {
    title: 'Name',
    align: 'start',
    sortable: false,
    key: 'FullName',
  },
  { title: 'IEP', key: 'IEP' },
  { title: 'First', key: 'FirstName' },
  { title: 'Last', key: 'LastName' },
  { title: 'Session', key: 'Session' },
  { title: 'ID', key: 'submissionIdInt' },
  { title: 'NewID', key: 'submissionId', align: ' d-none' },
  { title: 'Accommodations', key: 'Accommodations', align: ' d-none' },
  { title: 'Data Sheet', key: "Data_Sheet", align: ' d-none' },
  { title: 'DOB', key: 'DOB', align: ' d-none' },
  { title: 'Registration Date', key: 'CheckIn.Date' },
  { title: 'Registration Time', key: 'CheckIn.Time' },
  { title: 'Register', key: 'controls', sortable: false },
];

const checkIn = (item: any) => {
  if (item.CheckIn.Registered) {
    let reRegister = confirm(
      'This student appears to have already registered, are you sure would like to register this student?',
    );
    if (reRegister) {
    } else {
      rePrint.value = false;
      return;
    }
  }
  let now = new Date();
  let checkinData = {
    submissionId: item.submissionId,
    submissionIdInt: item.submissionIdInt,
    CheckIn: {
      Date: now.toDateString(),
      Time: now.toLocaleTimeString(),
      Timestamp: now,
      Registered: true,
    },
  };
  console.log(checkinData);
  try {
    studentStore.checkInOne(checkinData);
    const student = studentStore.students.filter(
      (each: any) => each.submissionId === item.submissionId,
    )[0];
    console.log(student);
    student.CheckIn = checkinData.CheckIn;
    studentStore.addLabel(item);
    registrant.value = item.FullName;
    snackbar.value = true;
  } catch (error) {
    console.log(error);
    return (snackerror.value = true);
  }
};

const print = (item: any) => {
  if (rePrint) {
    console.log(item);
    printIep(item);
    printLabel(item);
    //printPhone(item);
  } else {
    rePrint.value = true;
  }
};
</script>
