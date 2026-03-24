import { ConnectDB } from "~~/server/utils/db";
import SessionModel from '~~/server/models/session.model';

export default defineEventHandler(async (event) => {
  // Get data from body
  const body = await readBody(event);
  const sessionId =
    typeof body?.sessionId === 'string' && body.sessionId.trim()
      ? body.sessionId.trim()
      : 'unassigned';
  // Update a result
  await ConnectDB();
  try {
    const res = await SessionModel.create({ ...body, sessionId });
    return { message: 'Proctor Session Successfully Added' };
  } catch (e: any) {
    throw createError({
      message: e.message,
    });
  }
});
