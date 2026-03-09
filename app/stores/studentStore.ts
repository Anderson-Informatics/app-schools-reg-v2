import { defineStore } from "pinia";
import type { Student } from "~~/types";

export const useStudentStore = defineStore("student-store", {
  state: () => ({
    // list all results
    students: [] as Student[],
    student: {} as Partial<Student>,
    registrations: [] as Student[],
    summary: [] as any[],
  }),
  actions: {
    // Get all results from DB
    async getAll() {
      try {
        let data = await $fetch("/api/students");
        this.students = data as any;
        return data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async getTodaysRegistrations() {
      const today = new Date().toDateString();
      try {
        let data = await $fetch(`/api/students?CheckIn.Date=${today}`);
        this.registrations = data as any;
        return data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async checkInOne(checkInData: any) {
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
    async addToSession(student: Object) {
      try {
        let response = await $fetch("/api/sessions/register", {
          method: "POST",
          body: student,
        });
        console.log(response);
      } catch (e: any) {
        console.log(e.message);
      }
    },
    async addToSelectedSession(payload: {
      sessionId: string;
      student: Object;
    }) {
      try {
        let response = await $fetch("/api/sessions/registerSelected", {
          method: "POST",
          body: payload,
        });
        console.log(response);
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
        this.summary = data as any;
        return data;
      } catch (e: any) {
        console.log(e.message);
      }
    },
  },
});
