import { ConnectDB } from "~~/server/utils/db";
import SessionModel from '~~/server/models/session.model';

export default defineEventHandler(async (event) => {
  // Get data from body
  const body = await readBody(event);
  // Update a result
  await ConnectDB();
  try {
    const res = await SessionModel.create({ ...body });
    return { message: 'Proctor Session Successfully Added' };
  } catch (e: any) {
    throw createError({
      message: e.message,
    });
  }
});
