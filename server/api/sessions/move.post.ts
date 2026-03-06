import { ConnectDB } from "~~/server/utils/db";
import SessionModel from '~~/server/models/session.model';

export default defineEventHandler(async (event) => {
  // Get data from body
  const body = await readBody(event);
  // Update a result
  await ConnectDB();
  try {
    console.log('Moving student with data: ', body);
    const resRemove = await SessionModel.updateOne(
        { _id: body.moveOriginSessionId },
        { $pull: { students: { submissionId: body.student.submissionId } } }
    );
    const resAdd = await SessionModel.updateOne(
        {_id: body.moveTargetSessionId},
        { $push: { students: { ...body.student } } }
    );
    return { message: 'Student successfully moved.' };
  } catch (e: any) {
    throw createError({
      message: e.message,
    });
  }
});
