import { ConnectDB } from "~~/server/utils/db";
import AppointmentModel from "~~/server/models/appointment.model";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  await ConnectDB();
  const appointment = await AppointmentModel.find(query, {})
    .sort({ _id: -1 })
    .limit(1);
  return appointment;
});
