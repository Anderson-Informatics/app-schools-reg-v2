import { ConnectDB } from "~~/server/utils/db";
import AppointmentModel from "~~/server/models/appointment.model";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  await ConnectDB();
  const count = await AppointmentModel.countDocuments(query, {});
  return { appointment_count: count };
});
