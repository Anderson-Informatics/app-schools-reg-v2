import { ConnectDB } from "~~/server/utils/db";
import SessionModel from '~~/server/models/session.model';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { _id, ...updateData } = body;
  await ConnectDB();
  // Update a Session's Start time
  try {
    const res = await SessionModel.updateOne(
      { _id },
      { ...updateData },
    );
    console.log(`Session ${_id} updated: `, res);
    return res;
  } catch (e: any) {
    throw createError({
      message: e.message,
    });
  }
});
