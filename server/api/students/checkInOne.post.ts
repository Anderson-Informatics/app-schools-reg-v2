import { ConnectDB } from "~/utils/db";
import StudentModel from "~~/server/models/student.model";

export default defineEventHandler(async (event) => {
  // Get data from body
  const body = await readBody(event);
  // Update a result
  await ConnectDB();
  try {
    const res = await StudentModel.updateOne(
      { submissionId: body.submissionId },
      { CheckIn: body.CheckIn }
    );
    return { message: "Check In Successfully Completed" };
  } catch (e: any) {
    throw createError({
      message: e.message,
    });
  }
});
