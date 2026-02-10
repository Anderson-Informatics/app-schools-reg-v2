import { ConnectDB } from "~~/server/utils/db";
import AppointmentModel from "~~/server/models/appointment.model";

export default defineEventHandler(async (event) => {
  // Get data from body
  const body = await readBody(event);
  // Update a result
  await ConnectDB();
  try {
    const res = await AppointmentModel.create({ ...body });
    return { message: "New Appointment Successfully Added" };
  } catch (e: any) {
    throw createError({
      message: e.message,
    });
  }
});
