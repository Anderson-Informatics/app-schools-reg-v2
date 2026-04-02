import { ConnectDB } from "~~/server/utils/db";
import AppointmentModel from "~~/server/models/appointment.model";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  await ConnectDB();

  const latestAppointments = await AppointmentModel.aggregate([
    { $match: query },
    {
      $addFields: {
        _submittedDateForSort: {
          $dateFromString: {
            dateString: { $ifNull: ["$submissionDate", "$submittedDate"] },
            format: "%m/%d/%Y",
            onError: null,
            onNull: null,
          },
        },
      },
    },
    {
      $match: {
        _submittedDateForSort: { $gt: new Date("2026-01-01T00:00:00.000Z") },
      },
    },
    { $sort: { submissionId: 1, _submittedDateForSort: -1, _id: -1 } },
    {
      $group: {
        _id: "$submissionId",
        latestAppointment: { $first: "$$ROOT" },
      },
    },
    { $replaceRoot: { newRoot: "$latestAppointment" } },
    {
      $lookup: {
        from: "students",
        localField: "submissionId",
        foreignField: "submissionId",
        as: "student",
      },
    },
    {
      $addFields: {
        GradeEntering: { $arrayElemAt: ["$student.GradeEntering", 0] },
        FirstName: { $arrayElemAt: ["$student.FirstName", 0] },
        LastName: { $arrayElemAt: ["$student.LastName", 0] },
        ParentPhone: { $arrayElemAt: ["$student.ParentPhone", 0] },
      },
    },
    { $project: { _submittedDateForSort: 0, student: 0 } },
  ]);

  return latestAppointments;
});
