<template>
  <v-container>
    <v-card title="Testing Status" flat>
      <!--
      <v-spacer></v-spacer>
      {{ todaysregistrations }} Registered Today
       -->
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
        :items="studentStore.students"
        :search="search"
      >
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
          <div v-else>
            <span class="iep">{{ item.IEP }}</span>
          </div>
        </template>
        <!--
        <template v-slot:item.CheckIn.Registered="{ item }">
            <v-checkbox v-model="item.CheckIn.Registered" disabled></v-checkbox>
        </template>
        <template v-slot:item.CheckOut.CheckedOut="{ item }">
            <v-checkbox v-model="item.CheckOut.CheckedOut" disabled></v-checkbox>
        </template>
      -->
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
const studentStore = useStudentStore();
await useAsyncData('students', () => studentStore.getAll(), {});
const search = ref('');
const headers = [
  {
    title: 'Name',
    align: 'start',
    sortable: false,
    key: 'FullName',
    groupable: false,
  },
  { title: 'IEP', key: 'IEP' },
  { title: 'Registration Time', key: 'CheckIn.Time', groupable: false },
  { title: 'Test Start', key: 'TestSession.start', groupable: false },
  { title: 'Check Out Time', key: 'CheckOut.Time', groupable: false },
  //{ title: 'Registered', key: 'CheckIn.Registered' },
  //{ title: 'Checked Out', key: 'CheckOut.CheckedOut' },
];
</script>
