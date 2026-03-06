import { ConnectDB } from "~~/server/utils/db";
import SessionModel from '~~/server/models/session.model';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  await ConnectDB();
  console.log(query);
  const starttime = new Date().toLocaleString('en-US', {
    timeZone: 'America/Detroit',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
  // Update a Session's Start time
  try {
    const res = await SessionModel.updateOne(
      { _id: query.sid },
      { start: starttime },
    );
    console.log(res);
    return res;
    //return { message: "Testing Session Successfully Started" };
  } catch (e: any) {
    throw createError({
      message: e.message,
    });
  }
});
