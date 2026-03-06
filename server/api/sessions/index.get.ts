import { ConnectDB } from "~~/server/utils/db";
import SessionModel from '~~/server/models/session.model';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  await ConnectDB();
  const sessions = await SessionModel.find(query);
  return sessions;
});
