import { ConnectDB } from "~~/server/utils/db";
import SessionModel from '~~/server/models/session.model';
import StudentModel from '~~/server/models/student.model';

export default defineEventHandler(async (event) => {
  // Get data from body
  const body = await readBody(event);
  console.log(body);
  // Update a result
  await ConnectDB();
  try {
    const res = await SessionModel.updateOne(
      { _id: body.session._id },
      { $push: { students: body.student } },
    );
    console.log(res);
    const result = await StudentModel.updateOne(
      { SubmissionID: body.student.SubmissionID },
      { TestSession: body.session },
    );
    console.log(result);
    //return result
    return { message: 'Student Added to Session' };
  } catch (e: any) {
    throw createError({
      message: e.message,
    });
  }
});
