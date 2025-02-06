import { ConnectDB } from "~/utils/db";
import StudentModel from "~~/server/models/student.model";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  await ConnectDB();
  const roster = await StudentModel.find(query, {
    _id: 1,
    SubmissionID: 1,
    //submissionIdUnique: 1,
    FullName: 1,
    FirstName: 1,
    LastName: 1,
    CheckIn: 1,
  });
  return roster;
});
