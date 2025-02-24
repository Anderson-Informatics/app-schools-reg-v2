import { defineStore } from "pinia";

export const useStudentStore = defineStore("student-store", {
  state: () => ({
    // list all results
    students: [],
    student: {},
    registrations: [],
    summary: [],
  }),
  actions: {
    // Get all results from DB
    async getAll() {
      try {
        let data = await $fetch("/api/students");
        this.students = data;
        return data;
      } catch (e) {
        console.log(e.message);
      }
    },
    async getTodaysRegistrations() {
      const today = new Date().toDateString();
      try {
        let data = await $fetch(`/api/students?CheckIn.Date=${today}`);
        this.registrations = data;
        return data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async checkInOne(checkInData: Object) {
      try {
        let data = await $fetch("/api/students/checkInOne", {
          method: "POST",
          body: checkInData,
        });
        return {
          message: `Check In Successful for ${checkInData.submissionIdInt}`,
        };
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async addLabel(student: any) {
      try {
        let response = await $fetch("/api/submittable/add", {
          method: "POST",
          body: { ...student },
        });
        console.log(response);
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async getSummary() {
      try {
        let data = await $fetch("/api/summary");
        this.summary = data;
        return data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
  },
});
